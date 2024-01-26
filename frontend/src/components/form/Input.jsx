import React, { forwardRef } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(
  (
    { text, type, name, placeholder, helperText, multiple, value, ...props },
    ref
  ) => {
    return (
      <div className={styles.form_control}>
        <label>{text}</label>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          defaultValue={value}
          {...(multiple ? { multiple } : "")}
          ref={ref}
          {...props}
        />
        <span className="error-msg">{helperText}</span>
      </div>
    );
  }
);

export default Input;
