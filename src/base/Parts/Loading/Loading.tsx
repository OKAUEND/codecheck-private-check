import style from './Loading.module.scss';

export const LoadingBasicAnimation = () => {
  return (
    <article className={style.container}>
      <div className={style.loader} />
    </article>
  );
};
