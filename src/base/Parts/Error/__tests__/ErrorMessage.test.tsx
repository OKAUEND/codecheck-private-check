import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecoilRoot } from 'recoil';
import { describe, expect, test } from 'vitest';
import { ErrorBoundaryFallBack } from '@/src/base/Parts/Error/ErrorMessage';

describe('ErrorBoundaryFallBack', () => {
  test('画面にメッセージが表示できているか', () => {
    const status = 400;
    render(
      <RecoilRoot>
        <ErrorBoundaryFallBack status={status} />
      </RecoilRoot>
    );

    expect(
      screen.getByText('データ取得時に不具合が発生しました。')
    ).toBeInTheDocument();
  });

  test('画面にエラーステータスが表示できているか', () => {
    const status = 403;
    render(
      <RecoilRoot>
        <ErrorBoundaryFallBack status={status} />
      </RecoilRoot>
    );

    expect(screen.getByText('403')).toBeInTheDocument();
  });
});
