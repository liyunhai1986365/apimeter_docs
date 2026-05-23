#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_ENV_FILE="${DEPLOY_ENV_FILE:-$ROOT_DIR/scripts/deploy.target.env}"

log() {
  printf '\033[1;34m[deploy]\033[0m %s\n' "$*"
}

fail() {
  printf '\033[1;31m[deploy:error]\033[0m %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage:
  ./scripts/deploy-modelsell-docs.sh
  ./scripts/deploy-modelsell-docs.sh --full
  ./scripts/deploy-modelsell-docs.sh --build-only
  ./scripts/deploy-modelsell-docs.sh --upload-only
  ./scripts/deploy-modelsell-docs.sh --config-only

Modes:
  1, --full         Build, upload, install systemd, restart service.
  2, --build-only   Build Next standalone package locally only.
  3, --upload-only  Upload existing package and restart service.
  4, --config-only  Refresh systemd config and restart service. Does not upload package.
EOF
}

load_env_file() {
  local file="$1"
  [[ -f "$file" ]] || fail "Missing deploy env file: $file. Copy scripts/deploy.target.env.example to scripts/deploy.target.env first."
  set -a
  # shellcheck disable=SC1090
  source "$file"
  set +a
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"
}

require_var() {
  local name="$1"
  [[ -n "${!name:-}" ]] || fail "Missing required env: $name"
}

ssh_base_args=()
scp_base_args=()

remote_ssh() {
  if [[ -n "${DEPLOY_SSH_KEY:-}" ]]; then
    ssh "${ssh_base_args[@]}" -i "$DEPLOY_SSH_KEY" "$DEPLOY_USER@$DEPLOY_HOST" "$@"
  elif [[ -n "${DEPLOY_PASSWORD:-}" ]]; then
    SSHPASS="$DEPLOY_PASSWORD" sshpass -e ssh "${ssh_base_args[@]}" \
      -o PreferredAuthentications=password \
      -o PubkeyAuthentication=no \
      -o NumberOfPasswordPrompts=1 \
      "$DEPLOY_USER@$DEPLOY_HOST" "$@"
  else
    ssh "${ssh_base_args[@]}" "$DEPLOY_USER@$DEPLOY_HOST" "$@"
  fi
}

remote_scp() {
  if [[ -n "${DEPLOY_SSH_KEY:-}" ]]; then
    scp "${scp_base_args[@]}" -i "$DEPLOY_SSH_KEY" "$@"
  elif [[ -n "${DEPLOY_PASSWORD:-}" ]]; then
    SSHPASS="$DEPLOY_PASSWORD" sshpass -e scp "${scp_base_args[@]}" \
      -o PreferredAuthentications=password \
      -o PubkeyAuthentication=no \
      -o NumberOfPasswordPrompts=1 \
      "$@"
  else
    scp "${scp_base_args[@]}" "$@"
  fi
}

init_context() {
  load_env_file "$DEPLOY_ENV_FILE"

  DEPLOY_PORT="${DEPLOY_PORT:-22}"
  DEPLOY_USER="${DEPLOY_USER:-root}"
  DEPLOY_REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/www/wwwroot/modelsell-docs}"
  DEPLOY_SERVICE_NAME="${DEPLOY_SERVICE_NAME:-modelsell-docs}"
  DEPLOY_APP_PORT="${DEPLOY_APP_PORT:-3030}"

  require_var DEPLOY_HOST
  require_var DEPLOY_REMOTE_DIR
  require_var DEPLOY_SERVICE_NAME
  require_var DEPLOY_APP_PORT

  BUILD_DIR="$ROOT_DIR/build/modelsell-docs"
  PACKAGE_DIR="$BUILD_DIR/package"
  ARCHIVE_NAME="${DEPLOY_SERVICE_NAME}.tar.gz"
  ARCHIVE_PATH="$BUILD_DIR/$ARCHIVE_NAME"
  REMOTE_TMP_DIR="/tmp/${DEPLOY_SERVICE_NAME}-deploy"
  REMOTE_ARCHIVE="$REMOTE_TMP_DIR/$ARCHIVE_NAME"

  ssh_base_args=(-p "$DEPLOY_PORT" -o StrictHostKeyChecking=accept-new)
  scp_base_args=(-P "$DEPLOY_PORT" -o StrictHostKeyChecking=accept-new)
}

require_local_build_tools() {
  require_cmd pnpm
  require_cmd tar
}

require_remote_tools() {
  require_cmd ssh
  require_cmd scp

  if [[ -n "${DEPLOY_PASSWORD:-}" && -z "${DEPLOY_SSH_KEY:-}" ]]; then
    require_cmd sshpass
  fi
}

require_artifact() {
  [[ -f "$ARCHIVE_PATH" ]] || fail "Missing artifact: $ARCHIVE_PATH. Run --build-only first, or use --full."
}

build_package() {
  require_local_build_tools

  log "Install dependencies"
  (cd "$ROOT_DIR" && pnpm install --frozen-lockfile)

  log "Build Next standalone app"
  (cd "$ROOT_DIR" && pnpm build)

  [[ -f "$ROOT_DIR/.next/standalone/server.js" ]] || fail "Missing standalone server: .next/standalone/server.js"
  [[ -d "$ROOT_DIR/.next/static" ]] || fail "Missing static assets: .next/static"

  rm -rf "$BUILD_DIR"
  mkdir -p "$PACKAGE_DIR/.next"

  log "Collect standalone files"
  cp -R "$ROOT_DIR/.next/standalone/." "$PACKAGE_DIR/"
  cp -R "$ROOT_DIR/.next/static" "$PACKAGE_DIR/.next/static"
  if [[ -d "$ROOT_DIR/public" ]]; then
    cp -R "$ROOT_DIR/public" "$PACKAGE_DIR/public"
  fi

  log "Package artifact: $ARCHIVE_PATH"
  (
    cd "$PACKAGE_DIR"
    tar -czf "$ARCHIVE_PATH" .
  )
}

prepare_remote() {
  require_remote_tools
  log "Prepare remote directory: $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_REMOTE_DIR"
  remote_ssh "mkdir -p '$REMOTE_TMP_DIR' '$DEPLOY_REMOTE_DIR' '$DEPLOY_REMOTE_DIR/logs'"
}

require_remote_node() {
  log "Check remote Node.js runtime"
  remote_ssh "bash -s" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Missing remote node runtime. Install Node.js >=20.9.0 on the server, then rerun deployment." >&2
  exit 1
fi

node -e '
const version = process.versions.node.split(".").map(Number);
const ok = version[0] > 20 || (version[0] === 20 && version[1] >= 9);
if (!ok) {
  console.error(`Remote Node.js ${process.versions.node} is too old. Install Node.js >=20.9.0.`);
  process.exit(1);
}
'
REMOTE_SCRIPT
}

install_remote_service() {
  log "Install systemd config and restart service: $DEPLOY_SERVICE_NAME"
  require_remote_node
  remote_ssh "REMOTE_DIR='$DEPLOY_REMOTE_DIR' SERVICE_NAME='$DEPLOY_SERVICE_NAME' APP_PORT='$DEPLOY_APP_PORT' bash -s" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

mkdir -p "$REMOTE_DIR" "$REMOTE_DIR/logs"

cat >"/etc/systemd/system/${SERVICE_NAME}.service" <<EOF
[Unit]
Description=ModelSell Docs Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=${REMOTE_DIR}
Environment=NODE_ENV=production
Environment=PORT=${APP_PORT}
ExecStart=/usr/bin/env node ${REMOTE_DIR}/server.js
Restart=always
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
if [[ -f "$REMOTE_DIR/server.js" ]]; then
  systemctl restart "$SERVICE_NAME"
  sleep 2
  systemctl --no-pager --full status "$SERVICE_NAME" || journalctl -u "$SERVICE_NAME" -n 100 --no-pager
else
  echo "Config updated. server.js not found yet: $REMOTE_DIR/server.js"
fi
REMOTE_SCRIPT
}

upload_artifact() {
  require_artifact
  prepare_remote

  log "Upload package: $ARCHIVE_NAME"
  remote_scp "$ARCHIVE_PATH" "$DEPLOY_USER@$DEPLOY_HOST:$REMOTE_ARCHIVE"

  log "Extract package"
  remote_ssh "REMOTE_DIR='$DEPLOY_REMOTE_DIR' ARCHIVE_PATH='$REMOTE_ARCHIVE' bash -s" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

mkdir -p "$REMOTE_DIR" "$REMOTE_DIR/logs"
tar -xzf "$ARCHIVE_PATH" -C "$REMOTE_DIR"
chmod +x "$REMOTE_DIR/server.js"
REMOTE_SCRIPT

  install_remote_service
}

update_remote_config() {
  prepare_remote
  install_remote_service
}

full_deploy() {
  build_package
  upload_artifact
}

choose_mode() {
  cat >&2 <<EOF

请选择部署操作：
  1) 自动化打包上传并配置
  2) 只打包
  3) 只上传
  4) 更新服务配置
  q) 退出

EOF
  printf "请输入选项 [1-4/q]: " >&2
  read -r choice || choice="q"
  if [[ -z "$choice" ]]; then
    choice="q"
  fi
  echo "$choice"
}

run_mode() {
  local mode="$1"

  case "$mode" in
    1|full|--full)
      full_deploy
      log "Done. Remote service: $DEPLOY_SERVICE_NAME on port $DEPLOY_APP_PORT"
      ;;
    2|build|build-only|--build-only)
      build_package
      log "Done. Local artifact: $ARCHIVE_PATH"
      ;;
    3|upload|upload-only|--upload-only)
      upload_artifact
      log "Done. Uploaded artifact: $ARCHIVE_NAME"
      ;;
    4|config|config-only|--config-only)
      update_remote_config
      log "Done. Remote service config updated: $DEPLOY_SERVICE_NAME"
      ;;
    -h|--help|help)
      usage
      ;;
    q|Q|quit|exit)
      log "Canceled."
      ;;
    *)
      usage
      fail "Unknown option: $mode"
      ;;
  esac
}

main() {
  init_context

  local mode="${1:-}"
  if [[ -z "$mode" ]]; then
    if [[ -t 0 ]]; then
      mode="$(choose_mode)"
    else
      usage
      fail "No interactive terminal detected. Use --full, --build-only, --upload-only, or --config-only."
    fi
  fi

  run_mode "$mode"
}

main "$@"
