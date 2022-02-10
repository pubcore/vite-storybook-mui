import { LoadingIndicator, LoadingIndicatorProps } from "../";

export default {
  title: "Action Feedback/Loading indicator",
  argTypes: { refresh: { action: "refresh" } },
};
type Args = LoadingIndicatorProps;
export const Default = (args: Args) => (
    <LoadingIndicator {...{ ...args, refresh: undefined }} />
  ),
  Loading = (args: Args) => (
    <LoadingIndicator {...{ ...args, isLoading: true }} />
  ),
  WithRefreshIfNotLoading = (args: Args) => (
    <LoadingIndicator {...{ ...args, isLoading: false }} />
  );
