import React, { Component } from 'react';
import './App.css';
import { Router, Route, Switch } from 'react-router-dom';
import history from './components/history';

import Acceuil from "./components/Acceuil/acceuil";
import apropos from "./components/Apropos/apropos";
import Notfound from "./components/notfound/notfound";
import Navigbar from "./components/navbar/navbar";
import chapitre from "./components/chapitre/chapitre";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        user_id: null
    };
  }

  //mit à jour de l'identifiant de l'utilisateur depuis la navbar
  updateuser = (id) => {
    this.setState({ user_id: id });
  }

  render() {
    let userid = this.state.user_id;

    return (

      <Router history={history}>
      <div>
          <Navigbar updateuser={this.updateuser} />
          <Switch>
            <Route exact path="/" component={Acceuil} />
            <Route path="/apropos" component={apropos} />
            <Route path="/chapitre" component={chapitre} />
            <Route 
            path="/acceuil" 
            render={(props) => <Acceuil {...props} user_id={userid}/>} 
            />
            <Route component={Notfound} />
          </Switch>
        </div>
      </Router>

    );
  }
}

export default App;
