import { render } from "react-dom";
import App from "./App";
import { createTheme } from "./theme";
import { AppDecorator } from "./components/AppDecorator";

render(
  <AppDecorator {...{ createTheme }}>
    <App />
  </AppDecorator>,
  document.getElementById("root")
);
