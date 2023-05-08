import type { Meta, StoryObj } from '@storybook/react';
import { RadioList } from './index';
import { populationCategories } from '@/src/feature/PopulationChart/hook/usePopulation';

const meta = {
  title: 'Parts/RadioList',
  component: RadioList,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof RadioList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    categories: populationCategories,
    group: 'Mock',
    selected: populationCategories[0],
    changeHandler: () => {
      return;
    },
  },
};
