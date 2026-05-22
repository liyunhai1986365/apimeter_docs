import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CodeExampleTabs } from './code-example-tabs';

const examples = [
  {
    label: 'curl',
    language: 'bash',
    code: 'curl https://modelsell.com/v1/models',
  },
  {
    label: 'JavaScript',
    language: 'ts',
    code: "await fetch('https://modelsell.com/v1/models')",
  },
  {
    label: 'Python',
    language: 'python',
    code: 'client.models.list()',
  },
];

describe('CodeExampleTabs', () => {
  it('renders the first example by default', () => {
    render(<CodeExampleTabs examples={examples} />);

    expect(screen.getByRole('tab', { name: 'curl' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      screen.getByText('curl https://modelsell.com/v1/models'),
    ).toBeInTheDocument();
  });

  it('switches between code examples', async () => {
    const user = userEvent.setup();
    render(<CodeExampleTabs examples={examples} />);

    await user.click(screen.getByRole('tab', { name: 'Python' }));

    expect(screen.getByRole('tab', { name: 'Python' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('client.models.list()')).toBeInTheDocument();
  });

  it('copies the active example', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText');
    render(<CodeExampleTabs examples={examples} />);

    await user.click(screen.getByRole('tab', { name: 'JavaScript' }));
    await user.click(screen.getByRole('button', { name: 'Copy code' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "await fetch('https://modelsell.com/v1/models')",
      );
    });
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
