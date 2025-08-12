import type { ButtonHTMLAttributes } from "react";

import styles from "./ButtonX.module.scss";

interface ButtonXProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ButtonX = (props: ButtonXProps) => {
  const {
    "aria-controls": ariaControls,
    "aria-expanded": ariaExpanded,
    "aria-label": ariaLabel,
    "aria-pressed": ariaPressed,
    className,
    disabled,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    id,
    name,
    onBlur,
    onClick,
    onDoubleClick,
    onFocus,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    tabIndex,
    title,
    type,
    value,
  } = props;

  return (
    <button
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={`${styles.buttonX} ${className}`}
      disabled={disabled}
      form={form}
      formAction={formAction}
      formEncType={formEncType}
      formMethod={formMethod}
      formNoValidate={formNoValidate}
      formTarget={formTarget}
      id={id}
      name={name}
      onBlur={onBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onFocus={onFocus}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      tabIndex={tabIndex}
      title={title}
      type={type}
      value={value}
    >
      x
    </button>
  );
};
