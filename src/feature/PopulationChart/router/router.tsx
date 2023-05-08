import { Suspense } from 'react';
import style from '@/src/feature/PopulationChart/styles/router.module.scss';

import { PrefectureList } from '@/src/feature/PopulationChart/components/Prefectures';
import { PopulationChart } from '@/src/feature/PopulationChart/components/PopulationChart';

import { ErrorBoundaryExtended } from '@/src/base/Parts/Error';
import { LoadingBasicAnimation } from '@/src/base/Parts/Loading';

export const PopulationInfo = () => {
  return (
    <section className={style.population}>
      <ErrorBoundaryExtended>
        <Suspense fallback={<LoadingBasicAnimation />}>
          <PrefectureList />
          <div className={style.chart_container}>
            <Suspense fallback={<LoadingBasicAnimation />}>
              <PopulationChart />
            </Suspense>
          </div>
        </Suspense>
      </ErrorBoundaryExtended>
    </section>
  );
};
