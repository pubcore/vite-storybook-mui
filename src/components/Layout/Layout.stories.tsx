import { DefaultPage } from "../";
import { LoginPage as LoginP } from "../";
import Help from "../Help";
import Login from "../Login";
import { AppBar } from "..";

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
const logoUri = "https://picsum.photos/150";
export const Default = () => (
    <DefaultPage {...{ appBar, notification: null, sidebar: "«sidebar»" }} />
  ),
  LoginPage = () => <LoginP {...{ help, login, logoUri }} />,
  LoginPageWithBg = () => (
    <LoginP
      {...{ help, login, logoUri }}
      backgroundImgUri={"https://picsum.photos/1024"}
    />
  );
