import React, { Component } from 'react';
import './home.css';
import SubjectButton from '../subject_button/subject_button';
import axios from 'axios';
import Popup from 'react-popup';
import history from '../history';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: props.user_id,
      subjects : null,
    };
  }

  componentWillReceiveProps(value) {
    this.setState({
      user_id: value.user_id
    });
  }

  gotosubject = (subjectid, court) => {

    if(this.state.user_id != null){ //utilisateur connecté
      axios({
      method: 'post',
      url: 'http://localhost:4000/selectAdvancement',
      headers: {
          'crossDomain': true,  //For cors errors 
          'Content-Type': 'application/json'
      },
      data: {
        user_id : this.state.user_id,
        subject_id: subjectid
      }
    })
    .then(res => {
      if(res.data[0]===undefined){
        axios({
          method: 'post',
          url: 'http://localhost:4000/selectChapter',
          data: {
            subject_id: subjectid,
            start : true
          }
        })
        .then(res => {
          let result = res.data[0];
          if(result.body != null){
            history.push({
              pathname: '/chapter',
              state: { detail: result, userid:this.state.user_id, coursid:subjectid }
            })
          }
        }).catch(function(error){
            console.log('error selectChapter Advancement clickHandler '+error);
        });
      }else{
        axios({
          method: 'post',
          url: 'http://localhost:4000/selectChapter',
          data: {
            chapter_id: res.data[0].cours.idChapitre,
            start: false
          }
        }).then(res => {
          
          let resultat = res.data[0];
          if(resultat.body != null){
            Popup.plugins().Affiche(court,resultat,this.state.user_id,subjectid); 
          }
        }).catch(function(error){
          console.log('error selectChapter Advancement clickHandler '+error);
        });
      }
    })
    .catch(function(error) {
      console.log('error selectAdvancement clickHandler '+error);
    });
  }else{   //utilisateur anonyme
    axios({
      method: 'post',
      url: 'http://localhost:4000/selectChapter',
      data: {
        subject_id: subjectid,
        start : true
      }
    })
    .then(res => {
      let result = res.data[0];
      if(result.body != null){
        history.push({
          pathname: '/chapter',
          state: { detail: result,  userid:this.state.user_id, coursid:subjectid }
        })
      }
    })
    .catch(function(error) {
      console.log('error selectChapter nonconnecte clickHandler '+error);
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
            data[iEcriture] = <tr key={indice++}><td key={indice++} className='buttonSubject' colSpan='2'><SubjectButton click={this.gotosubject} key={indice++} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td></tr>;
            iEcriture++;
          }
        } else {
          data[iEcriture] = <tr key={indice++}><td key={indice++} className='buttonSubject' ><SubjectButton click={this.gotosubject} key={indice++} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td><td className='buttonSubject' ><SubjectButton click={this.gotosubject} key={iLecture + 1} subject_id={result[iLecture + 1].id} subject_label={result[iLecture + 1].label} /></td></tr>;
          iEcriture += 2;
        }
        iLecture += 2;
      }
      this.setState({subjects : data});
    })
    .catch(function(error) {
      console.log('error Home componentWillMount '+error);
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
              url: 'http://localhost:4000/selectChapter',
              data: {
                subject_id: cours_id,
                start : true
              }
            })
            .then(res => {
              let result = res.data[0];
              if(result.body != null){
                history.push({
                  pathname: '/chapter',
                  state: { detail:result, userid:user_id, coursid:cours_id }
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
                pathname: '/chapter',
                state: { detail:result, userid:user_id , coursid:cours_id }
              })
              Popup.close();
          }
      }]
    }
  });
});

export default Home;