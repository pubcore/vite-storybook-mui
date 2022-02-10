import Status from "./";

export default {
  title: "Action Feedback/Status",
};

export const Info = () => (
    <Status text="Smile, the wheather is great!" severity="info" />
  ),
  Error = () => (
    <Status text="Do not cry, it's not your fault!" severity="error" />
  );
