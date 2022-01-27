import { DefaultPage } from "../";
import { LoginPage as LoginP } from "../";
import Help from "../Help";
import Login from "../Login";
import { AppBar } from "..";
import Sidebar from "../Sidebar";
import { items } from "../Sidebar/items";
import { useState } from "react";

export default {
  title: "Layout",
};

const help = <Help uri="https://developer.mozilla.org" />;
const login = (
  <Login
    login={() => Promise.resolve({ textkey: "test", severity: "info" })}
    registerUri="https://localhost"
  />
);
const appBar = (
  <AppBar
    {...{
      isOpen: true,
      toggleSidebar: () => undefined,
      userMenu: "«userMenu»",
      loadingIndicator: "«loadingIndicator»",
    }}
  >
    «children»
  </AppBar>
);

function Example() {
  const [isOpen, setOpen] = useState(true);

  const sidebar = (
    <Sidebar
      {...{
        items,
        isOpen,
        toggle: () => setOpen(!isOpen),
        close: () => setOpen(false),
      }}
    />
  );

  const appBar = (
    <AppBar
      {...{
        isOpen,
        toggleSidebar: () => setOpen(!isOpen),
        userMenu: "«userMenu»",
        loadingIndicator: "«loadingIndicator»",
      }}
    >
      «children»
    </AppBar>
  );
  return <DefaultPage {...{ appBar, notification: null, sidebar }} />;
}

const logoUri = "https://picsum.photos/150";
export const Structure = () => (
    <DefaultPage {...{ appBar, notification: null, sidebar: "«sidebar»" }} />
  ),
  WithSidebar = () => <Example />,
  LoginPage = () => <LoginP {...{ help, login, logoUri }} />,
  LoginPageWithBg = () => (
    <LoginP
      {...{ help, login, logoUri }}
      backgroundImgUri={"https://picsum.photos/1024"}
    />
  );
