import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders the logo text', () => {
    render(<Logo />);
    // Logo now shows "opentaxation" as single word with ".my" suffix
    expect(screen.getByText(/opentaxation/i)).toBeInTheDocument();
    expect(screen.getByText('.my')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender, container } = render(<Logo size="sm" />);
    // sm size uses text-[15px]
    const textSpan = container.querySelector('span.font-medium');
    expect(textSpan).toHaveClass('text-[15px]');

    rerender(<Logo size="lg" />);
    // lg size uses text-[22px]
    const lgTextSpan = container.querySelector('span.font-medium');
    expect(lgTextSpan).toHaveClass('text-[22px]');
  });
});

