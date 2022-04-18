import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import PageHome from "./Pages/Home"
import PageLogin from "./Pages/Login";
import "./style.css"

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={PageHome}></Route>
        <Route path="/login" exact component={PageLogin}></Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
