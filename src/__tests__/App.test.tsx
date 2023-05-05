import App from '../App';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App TEST', () => {
  test('Vitest確認テスト', () => {
    render(<App></App>);

    expect(screen.findAllByText('Vite + React'));
  });
});
