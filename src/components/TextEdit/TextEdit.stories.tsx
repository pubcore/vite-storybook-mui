import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TextEdit } from "./TextEdit";

export default {
  title: "TextEdit",
};

export const Default = () => {
  const { t } = useTranslation();
  return (
    <TextEdit>
      <Box p={1}>
        {!new URLSearchParams(parent?.location.href).get("textedit") ? (
          <p>
            Click here to enable textedit mode:&nbsp;
            <a href={parent.location.href + "&textedit=1"}>enable</a>
          </p>
        ) : (
          <p>
            Move mouse pointer over text below and press «Space» key to
            show/edit used textkeys/text:
          </p>
        )}
        <div>
          {t("one")} {t("two")}
        </div>
      </Box>
    </TextEdit>
  );
};
