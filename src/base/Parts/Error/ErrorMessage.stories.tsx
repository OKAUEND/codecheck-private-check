import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundaryFallBack } from './ErrorMessage';
import { RecoilRoot } from 'recoil';

const meta = {
  title: 'Parts/ErrorBoundaryFallBack',
  component: ErrorBoundaryFallBack,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ErrorBoundaryFallBack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    status: 403,
  },
};
