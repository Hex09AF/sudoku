import type { LinksFunction } from "@remix-run/node";
import { forwardRef } from "react";
import styles from "./style.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles, as: "style" },
];

export const Input = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ ...props }, ref) => {
  return <input {...props} ref={ref} data-input />;
});

Input.displayName = "Input";
