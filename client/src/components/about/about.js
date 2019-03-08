import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import './about.css';

class About extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      key: 'home',
    };
  }

  render() {
    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={this.state.key}
        onSelect={key => this.setState({ key })}
      >
        <Tab eventKey="home" title="Projet">
          <p>Décrire le projet.</p>
        </Tab>
        <Tab eventKey="profile" title="Equipe">
        <p>Décrire l'équipe.</p>
        </Tab>
      </Tabs>
    );
  }
}

export default About;