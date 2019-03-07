import React, { Component } from 'react';
import './acceuil.css';
import SubjectButton from '../SubjectButton/subjectButton.js';
import axios from 'axios';


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
    }, () => {
      this.child[0].method(this.state.Username);
      this.child[1].method(this.state.Username);
      this.child[2].method(this.state.Username);
      this.child[3].method(this.state.Username);
      this.child[4].method(this.state.Username);
      this.child[5].method(this.state.Username);
    });
  }

  componentWillMount() {
    
    axios({
      method: 'post',
      url: 'http://localhost:4000/subjects',
      headers: {
          'crossDomain': true,  //For cors errors 
          'Content-Type': 'application/json'
      },
      data: {
         
      }
      }).then(res => {
         
        
        let result = res.data;
        let data = [];
        let iLecture = 0;
        let iEcriture = 0;

        while(iLecture < result.length) {
          if(iLecture === (result.length - 1)) {
            if((iLecture % 2) === 0) {
              data[iEcriture] = <tr><td className='buttonSubject' colSpan='2'><SubjectButton onRef={ref => (this.child[1] = ref)} Username={this.props.Username} key={iLecture} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td></tr>;
              iEcriture++;
            }
          } else {
            data[iEcriture] =
            <table className='tableSubject' key={"t1"}>
            <tbody key={"tb1"}>
     
            <tr>
              <td className='buttonSubject' ><SubjectButton onRef={ref => (this.child[0] = ref)} Username={this.props.Username} key={"a1"} subject_id={result[iLecture+1].id} subject_label={result[iLecture+1].label} /></td>
              <td className='buttonSubject' ><SubjectButton onRef={ref => (this.child[1] = ref)} Username={this.props.Username} key={"b1"} subject_id={result[iLecture].id} subject_label={result[iLecture].label} /></td>
            </tr>
            <tr>
              <td className='buttonSubject' ><SubjectButton onRef={ref => (this.child[2] = ref)} Username={this.props.Username} key={"c1"} subject_id={result[iLecture + 2].id} subject_label={result[iLecture + 2].label} /></td>
              <td className='buttonSubject' ><SubjectButton onRef={ref => (this.child[3] = ref)} Username={this.props.Username} key={"d1"} subject_id={result[iLecture + 3].id} subject_label={result[iLecture + 3].label} /></td>
            </tr>
            <tr>
              <td className='buttonSubject' ><SubjectButton onRef={ref => (this.child[4] = ref)} Username={this.props.Username} key={"e1"} subject_id={result[iLecture + 4].id} subject_label={result[iLecture + 4].label} /></td>
              <td className='buttonSubject' ><SubjectButton onRef={ref => (this.child[5] = ref)} Username={this.props.Username} key={"f1"} subject_id={result[iLecture + 5].id} subject_label={result[iLecture + 5].label} /></td>
            </tr>
         
            </tbody>
            </table>
            ;
            iEcriture += 6;
          }
          
          iLecture += 6;
        }
        
        this.setState({subjects : data});
        
      });

    }
   
  render(){
    return(
      <div>
      <div id='contenant'>
        <h1>Acceuil</h1>
        <br/>
            {this.state.subjects}
        </div>
        <div id="contenu">
        </div>
      </div>
    )
  };
}
export default Acceuil;