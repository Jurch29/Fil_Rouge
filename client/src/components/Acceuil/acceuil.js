import React, { Component } from 'react';

import Popup from 'reactjs-popup';
import './acceuil.css';

const Modal =  () => (
  <Popup trigger={<button className="button"> Chapitre X </button>} modal>
  {close => (
    <div className="modal">
      <button className="close" onClick={close}>
        &times;
      </button>
      <div className="header"> Chapitre X </div>
      <div className="content">
        Voulez vou continuer le Chapitre en cours ou recommencer le cours ?
      </div>
      <div className="actions">
      <button
          className="button"
          onClick={() => {
            close()
          }}
        >
          Recommencer
        </button>
        <button
          className="button"
          onClick={() => {
            close()
          }}
        >
          Continuer
        </button>
      </div>
    </div>
  )}
</Popup>
)
class Acceuil extends Component {
  render(){
    return(
      <div>
      <h1>Acceuil</h1>
      <Modal />
      </div>
    )
    };
  
}
export default Acceuil;
