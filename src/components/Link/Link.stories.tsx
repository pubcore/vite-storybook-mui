import { A } from "../";

export default {
  title: "Links",
  argTypes: {
    onClick: { action: "onClick" },
  },
};

export const External = (args: unknown[]) => (
    <A {...{ ...args, href: "https://google.com" }}>google</A>
  ),
  IllegalHref = () => (
    <A href="javascript:alert('test')">This text should appear, without link</A>
  );
