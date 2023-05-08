import { CheckBoxList } from '@/src/base/Parts/CheckBoxList';
import { usePrefectures } from '@/src/feature/PopulationChart/hook/usePrefectures';
import { useSelectedPrefectures } from '@/src/feature/PopulationChart/hook/useSelectedPrefectures';
import stlye from '@/src/feature/PopulationChart/styles/components/prefectures.module.scss';

export const PrefectureList = () => {
  const prefectures = usePrefectures();
  const [, selectPrefectures] = useSelectedPrefectures();
  return (
    <article className={stlye.prefectures}>
      <h2>都道府県</h2>
      <CheckBoxList values={prefectures} changeHandler={selectPrefectures} />
    </article>
  );
};
