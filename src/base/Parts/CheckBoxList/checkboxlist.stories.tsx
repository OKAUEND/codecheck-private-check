import type { Meta, StoryObj } from '@storybook/react';
import { CheckBoxList } from './index';
import { generatePrefectures } from '@/src/feature/PopulationChart/mock/predectures';

const meta = {
  title: 'Parts/CheckBoxList',
  component: CheckBoxList,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof CheckBoxList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    values: generatePrefectures(),
    changeHandler: () => {
      return;
    },
  },
};
