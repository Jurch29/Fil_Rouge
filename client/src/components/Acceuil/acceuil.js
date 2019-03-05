import React, { Component } from 'react';
import Popup from 'react-popup';
import './acceuil.css';
import {Button} from 'react-bootstrap';


class Acceuil extends Component {

  OnPopup(){
    Popup.create({
      title: null,
      content: 'Souhaitez vous continuer ce cour ou recommencer ?',
      buttons: {
          left: [{
              text: 'Annuler',
              className: 'danger',
              action: function () {
                  Popup.close();
              }
          }],
          right: [{
              text: 'Recommencer',
              key: 'ctrl+enter',
              action: function () {
                Popup.close();

              }
          }, {
              text: 'Continuer',
              className: 'success',
              action: function () {

                  Popup.close();
              }
          }]
      }
    });  
  }

  render(){
    return(
      <div>
      <h1>Acceuil</h1>
      <p>{this.props.Username}</p>
      <br></br>
      <Button variant="primary" onClick={() => this.OnPopup()}>NodeJS</Button>
      </div>
    )
    };
}
export default Acceuil;
