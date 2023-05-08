import { Radio } from '@/src/base/Element/Radio';
import style from './radiolist.module.scss';

interface Props {
  categories: string[];
  selected: string;
  group: string;
  changeHandler: (selected: string) => void;
}

export const RadioList = ({
  categories,
  selected,
  group,
  changeHandler,
}: Props) => {
  return (
    <ul className={style.listbase}>
      {categories.map((category, index) => (
        <li key={index} className={style.list}>
          <Radio
            categories={group}
            label={category}
            value={category}
            checked={selected === category}
            changeHandler={changeHandler}
          />
        </li>
      ))}
    </ul>
  );
};
