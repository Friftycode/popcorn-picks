import styles from './Pagination.module.less';
import classNames from 'classnames';

type SelectButtonsProps<T extends string | number> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  pagination?: boolean;
};

const Pagination = <T extends string | number>({
  options,
  value,
  onChange,
  className = '',
}: SelectButtonsProps<T>) => {
  const isValueLower = Number(value) < 2;
  const isValueInMiddle =
    Number(value) > 1 && Number(value) < options.length - 3;
  const isValueHigher = Number(value) > options.length - 4;

  const toButton = (opt: { value: T; label: string }) => (
    <button
      key={opt.value}
      className={classNames(
        styles.pagination,
        value === opt.value ? styles.active : '',
        className
      )}
      onClick={() => onChange(opt.value)}
    >
      {opt.label}
    </button>
  );

  return (
    <div className={styles.container}>
      {options.slice(0, !isValueLower ? 2 : 4).map(toButton)}
      {Number(value) > 2 && '...'}
      {isValueInMiddle &&
        options
          .slice(Number(value), Number(value) < 15 ? Number(value) + 3 : 17)
          .map(toButton)}
      {Number(value) < 14 && '...'}
      {options.slice(isValueHigher ? Number(value) : -2).map(toButton)}
    </div>
  );
};

export default Pagination;
