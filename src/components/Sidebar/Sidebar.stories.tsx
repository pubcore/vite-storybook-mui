import { Sidebar, SidebarProps } from "../";
import { items } from "./items";
type Args = SidebarProps;
export default {
  title: "Sidebar",
  argTypes: {
    toggle: { action: "toggle sidebar" },
    close: { action: "close sidebar" },
  },
  args: { items },
};

export const Default = (args: Args) => (
    <Sidebar {...{ ...args, isOpen: true }} />
  ),
  Closed = (args: Args) => <Sidebar {...{ ...args, isOpen: false }} />;
