import React, { Component } from 'react';
import './subjectButton.css';
import {Button} from 'react-bootstrap';
import Popup from 'react-popup';
import axios from 'axios';

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

  componentWillMount() {
    let self =this;
    console.log(self.state.id);
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
    if(this.props.Username != null && this.props.Username!=undefined){
        axios({
        method: 'post',
        url: 'http://localhost:4000/selectAvancement',
        headers: {
            'crossDomain': true,  //For cors errors 
            'Content-Type': 'application/json'
        },
        data: {
          user_id : this.props.Username,
          subject_id: this.props.subject_id
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
          console.log('error selectChapitre Avanacement clickHandler '+error);
        });
      })
      .catch(function(error) {
        console.log('error selectAvancement clickHandler '+error);
      });
    }else{
      axios({
        method: 'post',
        url: 'http://localhost:4000/selectChapitre',
        data: {
          Cours: this.props.subject_id,
          Commence : true
        }
      })
      .then(function(result) {
        result = result.data;
        if(result.body != null){
          //REDIRECTION
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

          //Invoquer la page Chapitre avec la data result
              Popup.close();
          }
        },{
          text: 'Continuer',
          className: 'success',
          action: function () {
            //REDIRECTION vers la page Chapitre avec la data result
              Popup.close();
          }
      }]
    }
  });
});

export default SubjectButton;
