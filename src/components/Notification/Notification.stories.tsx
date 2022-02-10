import { Notification, NotificationProps } from "../";

export default {
  title: "Action Feedback/Notification",
  argTypes: { notified: { action: "notified" } },
};
type Args = NotificationProps;
export const Success = (args: Args) => (
    <Notification
      {...{
        ...args,
        message: { textkey: "sun_shine", severity: "success" },
      }}
    />
  ),
  Warning = (args: Args) => (
    <Notification
      {...{
        ...args,
        message: {
          //to test string interpolation, this key is wrong, but i18n supports it
          textkey: "{{count}}_clouds",
          args: { count: 3 },
          severity: "warning",
        },
      }}
    />
  ),
  Error = (args: Args) => (
    <Notification
      {...{
        ...args,
        message: { severity: "error", textkey: "a_thunderstorm" },
      }}
    />
  ),
  NoTextkeyNoMessage = (args: Args) => <Notification {...{ ...args }} />;
