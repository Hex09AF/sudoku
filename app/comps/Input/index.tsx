import { forwardRef } from "react";
import styles from "./style.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const Input = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ ...props }, ref) => {
  return <input {...props} ref={ref} data-input />;
});

Input.displayName = "Input";
