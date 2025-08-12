import type { ButtonHTMLAttributes } from "react";

import { ButtonX } from "./ButtonX";
import styles from "./ButtonXTopright.module.scss";

export const ButtonXTopRight = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  // Not sure if this is a good idea for componnent lib to export this,
  // but this x/close button will posiition itself in the
  // top right of the nearest positioned ancestor.
  // Given it needs a positioned ancestor to work properly
  // this could make dx poor for external consumption/
  // better to export just the unpositioned x/close button and let the
  // consuming app handle positioning perhaps.
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
    <ButtonX
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
    />
  );
};
