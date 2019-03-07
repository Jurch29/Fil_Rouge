import React, { Component } from 'react';

import './chapitre.css';

class chapitre extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    console.log("Body html : "+this.props.location.state.detail);
    console.log("User_ID (chapitre): "+this.props.location.state.userid);
  }

  render() {
    return (
       
        <div dangerouslySetInnerHTML={{__html: this.props.location.state.detail}} />

        //ajout d'un bouton suivant qui recupere le chapitre suivant et qui met à jour l'avancement de l'user si il y en a un
      
    );
  }
}

export default chapitre;