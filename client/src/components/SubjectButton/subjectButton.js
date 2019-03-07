import React, { Component } from 'react';
import './subjectButton.css';
import {Button} from 'react-bootstrap';
import Popup from 'react-popup';
import axios from 'axios';

import history from '../history';



class SubjectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: props.Username,
      id : props.subject_id,
      label : props.subject_label,
      disabled : true
    }
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(null)
  }

  method(iduser) {
    this.setState({
      Username: iduser,
    });
    console.log("on est "+this.state.label)
  }

  componentWillMount() {
    this.setState({id:'1'});
    let self =this;
    axios({
      method: 'post',
      url: 'http://localhost:4000/subjectStartBy',
      data: {
        subject_id : self.state.id
      }
    })
    .then(function(result) {
      result = result.data;
      if(result.id != null) {
        self.setState({disabled : false});
      } else {
        self.setState({disabled : true});
      }
    })
    .catch(function(error) {
      console.log('error SubjectButton componentWillMount '+error);
    });
  }

  clickHandler() {
    var self =this;
    if(this.state.Username != null){
        axios({
        method: 'post',
        url: 'http://localhost:4000/selectAvancement',
        headers: {
            'crossDomain': true,  //For cors errors 
            'Content-Type': 'application/json'
        },
        data: {
          user_id : this.state.Username,
          subject_id: this.state.id
        }
      })
      .then(function(result) {
        
        axios({
          method: 'post',
          url: 'http://localhost:4000/selectChapitre',
          data: {
            Chapitre: result.data[0].cours.idChapitre,
            Commence: false
          }
        }).then(function(result){
          result = result.data[0];
          if(result.body != null){
            Popup.plugins().Affiche(self.state.label,result); 
          }
        }).catch(function(error){
          console.log('error selectChapitre Avancement clickHandler '+error);
        });
      })
      .catch(function(error) {
        console.log('error selectAvancement clickHandler '+error);
      });
    }else{
      let self =this;
      axios({
        method: 'post',
        url: 'http://localhost:4000/selectChapitre',
        data: {
          Cours: self.state.id,
          Commence : true
        }
      })
      .then(function(result) {
        result = result.data[0];
        if(result.body != null){
          //REDIRECTION
          history.push({
            pathname: '/chapitre',
            state: { detail: result.body }
          })
        }
      })
      .catch(function(error) {
        console.log('error selectChapitre nonconnecte clickHandler '+error);
      });
    }
  }

  render() {
    return (
        <Button className='buttonSubject' variant='success' size='lg' disabled={this.state.disabled} onClick={this.clickHandler} >{this.state.label}</Button> 
    );
  }
}

Popup.registerPlugin('Affiche', function (Cours, result ) {
  this.create({
    title: Cours,
    content: 'Voulez vous recommencer ou continuer au chapitre: '+result.titre+' ?',
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
          action: function () {
            history.push({
              pathname: '/chapitre',
              state: { detail: result.body }
            })

              Popup.close();
          }
        },{
          text: 'Continuer',
          className: 'success',
          action: function () {

              Popup.close();
              
              history.push({
                pathname: '/chapitre',
                state: { detail: result.body }
              })
          }
      }]
    }
  });
});

export default SubjectButton;
