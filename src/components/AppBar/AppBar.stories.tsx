import { useState } from "react";
import { AppBar, AppBarProps } from "../";

export default {
  title: "AppBar",
  argTypes: {
    toggleSidebar: { action: "toggle sidebar" },
  },
  args: { userMenu: "«user-menu»", loadingIndicator: "«loading-indicator»" },
};

type Args = AppBarProps;

export const Default = (args: Args) => {
    const [isOpen, open] = useState(false);
    return (
      <AppBar
        {...{
          ...args,
          isOpen,
          toggleSidebar: () => {
            open(!isOpen);
            args.toggleSidebar();
          },
        }}
      />
    );
  },
  WithTitle = (args: Args) => <AppBar {...args}>Title</AppBar>;
