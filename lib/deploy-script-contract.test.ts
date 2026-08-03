import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '..');
const scriptPath = path.join(root, 'scripts', 'deploy-modelsell-docs.sh');
const envExamplePath = path.join(root, 'scripts', 'deploy.target.env.example');
const nextConfigPath = path.join(root, 'next.config.mjs');
const gitignorePath = path.join(root, '.gitignore');

describe('deployment automation contract', () => {
  it('provides a docs deployment script with the same core modes as the API deployer', () => {
    expect(existsSync(scriptPath)).toBe(true);

    const script = readFileSync(scriptPath, 'utf8');

    expect(script).toContain('DEPLOY_ENV_FILE="${DEPLOY_ENV_FILE:-$ROOT_DIR/scripts/deploy.target.env}"');
    expect(script).toContain('--full');
    expect(script).toContain('--build-only');
    expect(script).toContain('--upload-only');
    expect(script).toContain('--config-only');
    expect(script).toContain('DEPLOY_APP_PORT="${DEPLOY_APP_PORT:-3030}"');
    expect(script).toContain('DEPLOY_SERVICE_NAME="${DEPLOY_SERVICE_NAME:-modelsell-docs}"');
    expect(script).toContain('DOCS_BRAND_NAME="${DOCS_BRAND_NAME:-${MODELSELL_DOCS_BRAND_NAME:-}}"');
    expect(script).toContain('DOCS_PUBLIC_BASE_URL="${DOCS_PUBLIC_BASE_URL:-${MODELSELL_PUBLIC_BASE_URL:-${NEXT_PUBLIC_MODELSELL_BASE_URL:-}}}"');
    expect(script).toContain('DOCS_API_BASE_URL="${DOCS_API_BASE_URL:-${MODELSELL_DOCS_API_BASE_URL:-}}"');
    expect(script).toContain('DOCS_API_KEY_NAME="${DOCS_API_KEY_NAME:-${MODELSELL_DOCS_API_KEY_NAME:-}}"');
  });

  it('packages the Next standalone server and static assets', () => {
    const script = readFileSync(scriptPath, 'utf8');

    expect(script).toContain('pnpm install --frozen-lockfile');
    expect(script).toContain('pnpm build');
    expect(script).toContain('.next/standalone');
    expect(script).toContain('.next/static');
    expect(script).toContain('.source');
    expect(script).toContain('content');
    expect(script).toContain('public');
    expect(script).toContain('server.js');
  });

  it('replaces stale remote files while preserving service logs', () => {
    const script = readFileSync(scriptPath, 'utf8');

    expect(script).toContain('! -name logs');
    expect(script).toContain('tar -xzf "$ARCHIVE_PATH" -C "$REMOTE_DIR"');
  });

  it('installs a systemd service that runs the standalone server on port 3030', () => {
    const script = readFileSync(scriptPath, 'utf8');

    expect(script).toContain('cat >"/etc/systemd/system/${SERVICE_NAME}.service"');
    expect(script).toContain('command -v node');
    expect(script).toContain('Missing remote node runtime');
    expect(script).toContain('Environment=PORT=${APP_PORT}');
    expect(script).toContain('Environment=DOCS_BRAND_NAME=${DOCS_BRAND_NAME}');
    expect(script).toContain('Environment=DOCS_PUBLIC_BASE_URL=${DOCS_PUBLIC_BASE_URL}');
    expect(script).toContain('Environment=DOCS_API_BASE_URL=${DOCS_API_BASE_URL}');
    expect(script).toContain('Environment=DOCS_API_KEY_NAME=${DOCS_API_KEY_NAME}');
    expect(script).toContain('ExecStart=/usr/bin/env node ${REMOTE_DIR}/server.js');
    expect(script).toContain('systemctl daemon-reload');
    expect(script).toContain('systemctl restart "$SERVICE_NAME"');
  });

  it('documents the target environment variables without committing secrets', () => {
    expect(existsSync(envExamplePath)).toBe(true);

    const example = readFileSync(envExamplePath, 'utf8');

    expect(example).toContain('DEPLOY_HOST=');
    expect(example).toContain('DEPLOY_REMOTE_DIR=/www/wwwroot/modelsell-docs');
    expect(example).toContain('DEPLOY_SERVICE_NAME=modelsell-docs');
    expect(example).toContain('DEPLOY_APP_PORT=3030');
    expect(example).toContain('DOCS_BRAND_NAME=');
    expect(example).toContain('DOCS_PUBLIC_BASE_URL=');
    expect(example).toContain('DOCS_API_BASE_URL=');
    expect(example).toContain('DOCS_API_KEY_NAME=');
    expect(example).toContain('DEPLOY_PASSWORD=');
    expect(example).not.toContain('sk-');
  });

  it('enables Next standalone output for server deployment artifacts', () => {
    const config = readFileSync(nextConfigPath, 'utf8');

    expect(config).toContain("output: 'standalone'");
  });

  it('keeps local deploy secrets and build artifacts out of git', () => {
    const gitignore = readFileSync(gitignorePath, 'utf8');

    expect(gitignore).toContain('scripts/deploy.target.env');
    expect(gitignore).toContain('build/');
  });
});
