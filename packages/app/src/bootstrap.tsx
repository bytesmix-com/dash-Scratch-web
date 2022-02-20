import { ColorModeScript } from "@chakra-ui/react";
import theme from "app/core/theme";
import { App } from "app/src/App";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
  document.getElementById("root"),
);
