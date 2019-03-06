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
    console.log("Cours id : "+this.props.subject_id+"  userid : "+this.props.Username);
    if(this.props.Username != null && this.props.Username!=undefined){
      console.log("connecté");
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
        console.log("Avancement result : "+result);
        axios({
          method: 'post',
          url: 'http://localhost:4000/selectChapitre',
          data: {
            Chapitre: result[0].coursIdChapitre,
            Commence: false
          }
        }).then(function(result){
          console.log(result.data[0].body);
          result = result.data;
          if(result[0].body != null){
            Popup.plugins().Affiche(this.props.subject_label,result); 
          }
        }).catch(function(error){
          console.log('error selectChapitre Avanacement clickHandler '+error);
        });
      })
      .catch(function(error) {
        console.log('error selectAvancement clickHandler '+error);
      });
    }else{
      console.log("non connecté");
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
        if(result[0].body != null){
          //REDIRECTION avec la data result[0].body
        }
      })
      .catch(function(error) {
        console.log('error selectChapitre clickHandler '+error);
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
    content: 'Voulez vous recommencer ou continuer au chapitre: '+result[0].titre+' ?',
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

          //Invoquer avec la data result[0].body
              Popup.close();
          }
        },{
          text: 'Continuer',
          className: 'success',
          action: function () {
            //REDIRECTION avec la data result[0].body
              Popup.close();
          }
      }]
    }
  });
});

export default SubjectButton;
