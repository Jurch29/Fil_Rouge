import React, { Component } from 'react';
import './acceuil.css';
import SubjectButton from '../SubjectButton/subjectButton.js';
import axios from 'axios';
import Popup from 'react-popup';
import history from '../history';

class Acceuil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: props.Username,
      subjects : null,
    };
    this.child = []
  }

  componentWillReceiveProps(value) {
    this.setState({
      Username: value.Username
    });
  }

  ButtonClicked = (value, value2) => {

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
        subject_id: value
      }
    })
    .then(res => {
      if(res.data[0]===undefined){
        axios({
          method: 'post',
          url: 'http://localhost:4000/selectChapitre',
          data: {
            Cours: value,
            Commence : true
          }
        })
        .then(res => {
          let result = res.data[0];
          if(result.body != null){
            history.push({
              pathname: '/chapitre',
              state: { detail: result,  userid:this.state.Username, coursid:value }
            })
          }
        }).catch(function(error){
            console.log('error selectChapitre Avancement clickHandler '+error);
        });
      }else{
        axios({
          method: 'post',
          url: 'http://localhost:4000/selectChapitre',
          data: {
            Chapitre: res.data[0].cours.idChapitre,
            Commence: false
          }
        }).then(res => {
          
          let resultat = res.data[0];
          if(resultat.body != null){
            Popup.plugins().Affiche(value2,resultat,this.state.Username,value); 
          }
        }).catch(function(error){
          console.log('error selectChapitre Avancement clickHandler '+error);
        });
      }
    })
    .catch(function(error) {
      console.log('error selectAvancement clickHandler '+error);
    });
  }else{
    axios({
      method: 'post',
      url: 'http://localhost:4000/selectChapitre',
      data: {
        Cours: value,
        Commence : true
      }
    })
    .then(res => {
      let result = res.data[0];
      if(result.body != null){
        history.push({
          pathname: '/chapitre',
          state: { detail: result,  userid:this.state.Username, coursid:value }
        })
      }
    })
    .catch(function(error) {
      console.log('error selectChapitre nonconnecte clickHandler '+error);
    });
  }
  }
 
  componentWillMount() {
    axios({
      method: 'post',
      url: 'http://localhost:4000/subjects',
    })
    .then(res => {
      let result = res.data;
      let data = [];
      let iLecture = 0;
      let iEcriture = 0;
      let indice=0;
      while(iLecture < result.length) {
        if(iLecture === (result.length - 1)) {
          if((iLecture % 2) === 0) {
            data[iEcriture] = <tr key={indice++}><td key={indice++} className='buttonSubject' colSpan='2'><SubjectButton click={this.ButtonClicked} key={indice++} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td></tr>;
            iEcriture++;
          }
        } else {
          data[iEcriture] = <tr key={indice++}><td key={indice++} className='buttonSubject' ><SubjectButton click={this.ButtonClicked} key={indice++} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td><td className='buttonSubject' ><SubjectButton click={this.ButtonClicked} key={iLecture + 1} subject_id={result[iLecture + 1].id} subject_label={result[iLecture + 1].label} /></td></tr>;
          iEcriture += 2;
        }
        iLecture += 2;
      }
      this.setState({subjects : data});
    })
    .catch(function(error) {
      console.log('error Acceuil componentWillMount '+error);
    });
  }
   
  render(){
    return(
      <div>
      <div id='contenant'>
        <h1>Acceuil</h1>
        <br/>
        <table className='tableSubject'>
          <tbody>
            {this.state.subjects}
          </tbody>
        </table>
        </div>
        <div id="contenu">
        </div>
      </div>
    )
  };
}

Popup.registerPlugin('Affiche', function (Cours,result,user_id,cours_id) {
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
            axios({
              method: 'post',
              url: 'http://localhost:4000/selectChapitre',
              data: {
                Cours: cours_id,
                Commence : true
              }
            })
            .then(res => {
              let result = res.data[0];
              if(result.body != null){
                history.push({
                  pathname: '/chapitre',
                  state: { detail: result,  userid:user_id, coursid:cours_id }
                })
              }
            })
            .catch(function(error) {
              console.log('error popup recommencer '+error);
            });
              Popup.close();
          }
        },{
          text: 'Continuer',
          className: 'success',
          action: function () {
              history.push({
                pathname: '/chapitre',
                state: { detail: result, userid:user_id , coursid:cours_id }
              })
              Popup.close();
          }
      }]
    }
  });
});


export default Acceuil;