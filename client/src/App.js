import React, { Component } from 'react';
import './App.css';
import { Router, Route, Switch } from 'react-router-dom';
import history from './components/history';

import Home from "./components/home/home";
import About from "./components/about/about";
import Not_found from "./components/not_found/not_found";
import Navigbar from "./components/navbar/navbar";
import Chapter from "./components/chapter/chapter";

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
          <Navigbar updateuser={this.update_user} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/chapter" component={Chapter} />
            <Route 
            path="/home" 
            render={(props) => <Home {...props} user_id={userid}/>} 
            />
            <Route component={Not_found} />
          </Switch>
        </div>
      </Router>

    );
  }
}

export default App;
