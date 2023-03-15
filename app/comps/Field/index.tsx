import { Input, links as inputLinks } from "../Input";

import styles from "./style.css";

export const links = () => [
  ...inputLinks(),
  { rel: "stylesheet", href: styles },
];

interface FieldProps {
  errorMsg: string | undefined;
  label: string;
}

export const Field = ({
  errorMsg,
  label,
  ...inputProps
}: FieldProps & JSX.IntrinsicElements["input"]) => (
  <div data-field>
    <label htmlFor={inputProps.id}>{label}</label>
    <Input {...inputProps} ref={null} />
    {errorMsg ? (
      <p className="field-error" role="alert">
        {errorMsg}
      </p>
    ) : null}
  </div>
);
