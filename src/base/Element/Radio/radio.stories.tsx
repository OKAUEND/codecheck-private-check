import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './index';

const meta = {
  title: 'Element/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    label: '仮総人口',
    value: '仮総人口',
    checked: false,
    categories: 'mock',
    changeHandler: () => {
      return;
    },
  },
};
