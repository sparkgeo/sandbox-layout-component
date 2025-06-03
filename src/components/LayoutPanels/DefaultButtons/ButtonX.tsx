import type { ButtonHTMLAttributes } from "react";
import styles from "./ButtonX.module.scss";

interface ButtonXProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  classNamef?: string;
}

export const ButtonX = (props: ButtonXProps) => {
  const { className, ...restOfProps } = props;

  return (
    <button {...restOfProps} className={`${styles.buttonX} ${className}`}>
      x
    </button>
  );
};
