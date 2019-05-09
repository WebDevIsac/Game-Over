import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./style/GlobalStyle";
import theme from "./style/theme";

// Pages
import Game from "./pages/Game";

const App = () => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <GlobalStyle />
      <Router>
        <Route path="/" component={Game} />
      </Router>
    </Fragment>
  </ThemeProvider>
);

export default App;
