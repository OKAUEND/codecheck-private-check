import type { Meta, StoryObj } from '@storybook/react';
import { CheckBox } from './index';

const meta = {
  title: 'Element/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    label: '都道府県市',
    value: 1,
    changeHandler: () => {
      return;
    },
  },
};
