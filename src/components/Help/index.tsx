import { A } from "../";
import { Trans } from "react-i18next";

export default function Help({ uri }: { uri: string }) {
  return (
    <span>
      <Trans i18nKey="general_help">
        Need help? <A href={uri}>Click here</A> and let us help you.
      </Trans>
    </span>
  );
}
