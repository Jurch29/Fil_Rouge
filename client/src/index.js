import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Popup from 'react-popup';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";

import Acceuil from "./components/Acceuil/acceuil";
import apropos from "./components/Apropos/apropos";
import Notfound from "./components/notfound/notfound";
import Navigbar from "./components/navbar/navbar"

const routing = (
  <Router>
    <div>
    
    <Navigbar />

      <Switch>
        <Route exact path="/" component={Acceuil} />
        <Route path="/acceuil" component={Acceuil} />
        <Route path="/apropos" component={apropos} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(<Popup/>, document.getElementById("popup"));
ReactDOM.render(routing, document.getElementById("root"));