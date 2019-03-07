import React, { Component } from 'react';
import './subjectButton.css';
import {Button} from 'react-bootstrap';
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

    axios({
      method: 'post',
      url: 'http://localhost:4000/subjectStartBy',
      data: {
        subject_id : this.state.id
      }
    })
    .then(res => {
      let result = res.data;
      if(result.id != null) {
        this.setState({disabled : false});
      } else {
        this.setState({disabled : true});
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
            Popup.plugins().Affiche(self.state.label,result,self.state.Username,self.state.id); 
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
      console.log(this.state.Username)
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
          history.push({
            pathname: '/chapitre',
            state: { detail: result,  userid:self.state.Username, coursid:self.state.id }
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

export default SubjectButton;
