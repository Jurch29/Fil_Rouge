import React, { Component } from 'react';

import './chapitre.css';

class chapitre extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    console.log(this.props.location.state.detail);
  }

  render() {
    return (
       
        <div dangerouslySetInnerHTML={{__html: this.props.location.state.detail}} />
      
    );
  }
}

export default chapitre;