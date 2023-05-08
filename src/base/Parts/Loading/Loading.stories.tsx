import type { Meta, StoryObj } from '@storybook/react';
import { LoadingBasicAnimation } from './index';

const meta = {
  title: 'Parts/LoadingBasicAnimation',
  component: LoadingBasicAnimation,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof LoadingBasicAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
