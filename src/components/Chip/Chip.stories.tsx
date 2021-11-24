import { Warning, Error, Ok, Info } from "./";

export default {
  title: "Chips",
};

export const OK = () => <Ok label="Ok" />,
  INFO = () => <Info label="Info" />,
  WARNING = () => <Warning label="warn" />,
  ERROR = () => <Error label="Error" />;
