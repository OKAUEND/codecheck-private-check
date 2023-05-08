import {
  usePopulation,
  usePopulationCategories,
} from '@/src/feature/PopulationChart/hook/usePopulation';
import { LineChrt } from '@/src/base/Parts/Chart';
import { RadioList } from '@/src/base/Parts/RadioList';
import { useSelectedPrefectures } from '../../hook/useSelectedPrefectures';
import style from '@/src/feature/PopulationChart/styles/components/populationChart.module.scss';

export const PopulationChart = () => {
  const population = usePopulation();
  const [selectedPref] = useSelectedPrefectures();
  const [categories, selectedCategory, changeCategory] =
    usePopulationCategories();

  return (
    <article className={style.populationChart}>
      <h2>人口</h2>
      <div className={style.populationCategories}>
        <RadioList
          categories={categories}
          selected={selectedCategory}
          group="populationCategories"
          changeHandler={changeCategory}
        />
      </div>
      <LineChrt populationInfo={population} selectedPref={selectedPref} />
    </article>
  );
};
