import React, { Component } from 'react';
import './navbar.css';
import {Nav, Navbar, Form, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import ReactModalLogin from "react-modal-login";
import axios from 'axios';

class Navigbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      loggedIn: null,
      loading: false,
      error: null,
      initialTab: null,
      recoverPasswordSuccess: null,
    };
  }

  onLogin() {
    this.startLoading();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!email || !password) {
      this.setState({
        error: true
      })
    }
    else{
      axios({
        method: 'post',
        url: 'http://localhost:4000/auth',
        headers: {
            'crossDomain': true,  //For cors errors 
            'Content-Type': 'application/json'
        },
        data: {
            login: email,
            passwd: password
        }
        }).then(res => {
            if (res.data === "failed"){
              this.setState({
                error: true
              })
            }
            else {
              console.log(res.data);
              this.onLoginSuccess(res.data.username);
              this.props.updateuser(res.data.id); //déclenche la méthode updateuser dans le parent (app.js)
            }
        });
    }
    this.finishLoading();
  }

  onRegister() {

    const login = document.querySelector('#login').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!login || !email || !password) {
      this.setState({
        error: true
      })
    } else {

      axios({
        method: 'post',
        url: 'http://localhost:4000/register',
        headers: {
            'crossDomain': true,  //For cors errors 
            'Content-Type': 'application/json'
        },
        data: {
            login: email,
            passwd: password,
            firstname: login
        }
        }).then(res => {
            if (res.data === "failed"){
              this.setState({
                error: true
              })
            }
            
            else {
              this.closeModal();
            }  
        });
    }
  }

  onRecoverPassword() {
    const email = document.querySelector('#email').value;

    if (!email) {
      this.setState({
        error: true,
        recoverPasswordSuccess: false
      })
    } else {
      this.setState({
        error: null,
        recoverPasswordSuccess: true
      });
    }
  }

  openModal(initialTab) {
    this.setState({
      initialTab: initialTab
    }, () => {
      this.setState({
        showModal: true,
      })
    });
  }

  onLoginSuccess(method, response) {

    this.closeModal();
    this.setState({
      loggedIn: method,
      loading: false
    })
  }

  onLoginFail(method, response) {

    this.setState({
      loading: false,
      error: response
    })
  }

  startLoading() {
    this.setState({
      loading: true
    })
  }

  finishLoading() {
    this.setState({
      loading: false
    })
  }

  afterTabsChange() {
    this.setState({
      error: null,
      recoverPasswordSuccess: false,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null
    });
  }

  render() {

    const loggedIn = this.state.loggedIn;
    const isLoading = this.state.loading;

    return (
      
     <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">DB.JAAP</Navbar.Brand>
        <Nav className="mr-auto">

          <li className="acceuil"><Link to="/home">Acceuil</Link></li>
          <li><Link to="/about">A propos</Link></li>

        </Nav>

        {loggedIn ? (
          <div className="login">
            {loggedIn}
          </div>
        ) : (
          <Form inline>
            <Button onClick={() => this.openModal()} variant="outline-info">Connexion</Button>
          </Form>
        )}

      </Navbar>
      <br />

      <ReactModalLogin
      visible={this.state.showModal}
      onCloseModal={this.closeModal.bind(this)}
      loading={isLoading}
      initialTab={this.state.initialTab}
      error={this.state.error}
      tabs={{
        afterChange: this.afterTabsChange.bind(this)
      }}
      startLoading={this.startLoading.bind(this)}
      finishLoading={this.finishLoading.bind(this)}
      form={{
        onLogin: this.onLogin.bind(this),
        onRegister: this.onRegister.bind(this),
        onRecoverPassword: this.onRecoverPassword.bind(this),

        recoverPasswordSuccessLabel: this.state.recoverPasswordSuccess
          ? {
              label: "Un message a été envoyé sur votre boîte mail."
            }
          : null,
        recoverPasswordAnchor: {
          label: "Mot de passe oublié ?"
        },
        loginBtn: {
          label: "Se connecter"
        },
        registerBtn: {
          label: "S'inscrire"
        },
        recoverPasswordBtn: {
          label: "Envoyer"
        },
        loginInputs: [
          {
            containerClass: 'RML-form-group',
            label: 'Email',
            type: 'email',
            inputClass: 'RML-form-control',
            id: 'email',
            name: 'email',
            placeholder: 'Email',
          },
          {
            containerClass: 'RML-form-group',
            label: 'Mot de passe',
            type: 'password',
            inputClass: 'RML-form-control',
            id: 'password',
            name: 'password',
            placeholder: 'Password',
          }
        ],
        registerInputs: [
          {
            containerClass: 'RML-form-group',
            label: 'Prénom',
            type: 'text',
            inputClass: 'RML-form-control',
            id: 'login',
            name: 'login',
            placeholder: 'Nickname',
          },
          {
            containerClass: 'RML-form-group',
            label: 'Email',
            type: 'email',
            inputClass: 'RML-form-control',
            id: 'email',
            name: 'email',
            placeholder: 'Email',
          },
          {
            containerClass: 'RML-form-group',
            label: 'Mot de passe',
            type: 'password',
            inputClass: 'RML-form-control',
            id: 'password',
            name: 'password',
            placeholder: 'Password',
          }
        ],
        recoverPasswordInputs: [
          {
            containerClass: 'RML-form-group',
            label: 'Email',
            type: 'email',
            inputClass: 'RML-form-control',
            id: 'email',
            name: 'email',
            placeholder: 'Email',
          },
        ],
      }}
    />
    </>

    );
  }
}

export default Navigbar;
