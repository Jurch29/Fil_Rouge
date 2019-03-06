import React, { Component } from 'react';
import './acceuil.css';
import SubjectButton from '../SubjectButton/subjectButton.js';
import axios from 'axios';


class Acceuil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: props.Username,
      subjects : null
    };
  }
  componentWillMount() {
    let self = this;
    axios({
      method: 'post',
      url: 'http://localhost:4000/subjects',
    })
    .then(function(result) {
      result = result.data;
      let data = [];
      let iLecture = 0;
      let iEcriture = 0;
      while(iLecture < result.length) {
        if(iLecture === (result.length - 1)) {
          if((iLecture % 2) === 0) {
            data[iEcriture] = <tr><td className='buttonSubject' colSpan='2'><SubjectButton Username={self.props.Username} key={iLecture} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td></tr>;
            iEcriture++;
          }
        } else {
          data[iEcriture] = <tr><td className='buttonSubject' ><SubjectButton Username={self.props.Username} key={iLecture} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td><td className='buttonSubject' ><SubjectButton Username={self.props.Username} key={iLecture + 1} subject_id={result[iLecture + 1].id} subject_label={result[iLecture + 1].label} /></td></tr>;
          iEcriture += 2;
        }
        iLecture += 2;
      }
      self.setState({subjects : data});
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
export default Acceuil;