import { forwardRef } from "react";
import styles from "./style.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const Button = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>(({ children, ...props }, ref) => {
  return (
    <button {...props} ref={ref} data-button>
      {children}
    </button>
  );
});

Button.displayName = "Button";
