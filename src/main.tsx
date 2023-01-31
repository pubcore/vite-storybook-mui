import { createRoot } from "react-dom/client";
import App from "./App";
import { createTheme } from "./theme";
import { AppDecorator } from "./components/AppDecorator";

// see https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

createRoot(document.getElementById("root")!).render(
  <AppDecorator {...{ createTheme }}>
    <App />
  </AppDecorator>
);
