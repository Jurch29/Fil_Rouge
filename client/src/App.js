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
        listDataFromChild: null
    };    
  }

  updateuser = (dataFromChild) => {
    this.setState({ listDataFromChild: dataFromChild });
  }

  render() {

    let isAuthenticated = this.state.listDataFromChild;

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
            render={(props) => <Acceuil {...props} Username={isAuthenticated}/>} 
            />
            <Route component={Notfound} />
          </Switch>
        </div>
      </Router>

    );
  }
}

export default App;
