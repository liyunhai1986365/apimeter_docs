import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InstallCommandSwitcher } from './install-command-switcher';

const macCommand =
  'curl -fsSL https://static.modelsell.com/modelsell-cli/install.sh | sh';
const windowsCommand =
  'powershell -ExecutionPolicy Bypass -c "irm https://static.modelsell.com/modelsell-cli/install.ps1 | iex"';

describe('InstallCommandSwitcher', () => {
  it('shows macOS and Linux command by default', () => {
    render(<InstallCommandSwitcher />);

    expect(screen.getByRole('tab', { name: 'macOS / Linux' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(macCommand)).toBeInTheDocument();
  });

  it('switches to Windows command', async () => {
    const user = userEvent.setup();
    render(<InstallCommandSwitcher />);

    await user.click(screen.getByRole('tab', { name: 'Windows' }));

    expect(screen.getByRole('tab', { name: 'Windows' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(windowsCommand)).toBeInTheDocument();
  });

  it('copies the selected install command', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText');
    render(<InstallCommandSwitcher />);

    await user.click(screen.getByRole('tab', { name: 'Windows' }));
    await user.click(screen.getByRole('button', { name: '复制命令' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(windowsCommand);
    });
    expect(screen.getByRole('button', { name: '已复制' })).toBeInTheDocument();
  });

  it('falls back when Clipboard API is unavailable', async () => {
    const user = userEvent.setup();
    vi.spyOn(window.navigator.clipboard, 'writeText').mockRejectedValueOnce(
      new Error('clipboard blocked'),
    );
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => true),
    });
    render(<InstallCommandSwitcher />);

    await user.click(screen.getByRole('tab', { name: 'Windows' }));
    await user.click(screen.getByRole('button', { name: '复制命令' }));

    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
    expect(screen.getByRole('button', { name: '已复制' })).toBeInTheDocument();
  });
});
