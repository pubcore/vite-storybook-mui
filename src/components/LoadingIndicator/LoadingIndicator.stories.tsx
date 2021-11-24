import { LoadingIndicator, LoadingIndicatorProps } from "../";

export default {
  title: "Loading indicator",
  argTypes: { refresh: { action: "refresh" } },
};
type Args = LoadingIndicatorProps;
export const Default = (args: Args) => <LoadingIndicator {...{ ...args }} />,
  Loading = (args: Args) => (
    <LoadingIndicator {...{ ...args, isLoading: true }} />
  );
