import { CheckBox } from '@/src/base/Element/CheckBox';
import { Prefectures } from '@/src/types/resas';
import { SelectedCheckbox } from '@/src/types/Element';
import style from './checkboxlist.module.scss';

interface Props {
  values: Prefectures[];
  changeHandler: (selected: SelectedCheckbox) => void;
}

export const CheckBoxList = ({ values, changeHandler }: Props) => {
  return (
    <ul className={style.listbase}>
      {values.map((value) => (
        <li key={value.prefCode} className={style.list}>
          <CheckBox
            label={value.prefName}
            value={value.prefCode}
            changeHandler={changeHandler}
          />
        </li>
      ))}
    </ul>
  );
};
