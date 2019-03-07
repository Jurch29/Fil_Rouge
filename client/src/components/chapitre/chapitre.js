import React, { Component } from 'react';
import './chapitre.css';
import {Button} from 'react-bootstrap';
import axios from 'axios';

class chapitre extends Component {
    constructor(props, context) {
        super(props);
        let detail =this.props.location.state.detail;
        let cours =this.props.location.state.coursid;
        let user =this.props.location.state.userid;
        this.state = {
            Username: user,
            body : detail.body,
            titre : detail.titre,
            auteur : detail.auteur,
            idChapitre : detail.id,
            idCours: cours,
            next : null,
            menu : null
        }
        this.clickHandler = this.clickHandler.bind(this);
    }

    componentWillMount() {
        let self=this;
        console.log(self.state.idCours);
        axios({
            method: 'post',
            url: 'http://localhost:4000/getmenu',
            data: {
                Cours: self.state.idCours
            }
        })
        .then(function(result) {
            result = result.data;
            let data = [result.length];
            let iLecture=0,conteur=0;
            while(iLecture < result.length) {
                if(result[iLecture][0].titre===self.state.titre){
                    data[iLecture] = <li key={conteur++} className="Chapitreactuel">{result[iLecture][0].titre}</li>;
                }else{
                    data[iLecture] = <li key={conteur++}>{result[iLecture][0].titre}</li>;
                }
                iLecture ++;
                
            }
            data.sort();
            self.setState({menu :data});
        })
        .catch(function(error) {
            console.log('error chapite componentWillMount '+error);
        });
    }
    clickHandler(){
        let self=this;
        console.log(self.state.Username);
        axios({
            method: 'post',
            url: 'http://localhost:4000/avancement',
            data: {
                user_id: self.state.Username,
                idcours: self.state.idCours,
                idChapitre: self.state.idChapitre
            }
        })
        .then(function(result) {
           console.log(result);
        })
        .catch(function(error) {
            console.log('error chapite componentWillMount '+error);
        });
    }
  render(){
      return(
        <div>
            <div>

            <ul className="Menu">
                {this.state.menu}
            </ul>
                <h1 className="titre">{this.state.titre}</h1>
                <h2 className="auteur">Auteur : {this.state.auteur}</h2>
                <br/>
                <br/>
                <div className="lechapitre"dangerouslySetInnerHTML={{__html: this.state.body}}></div>
            </div>
            <br/>
            <div className="contenantSuivant">
                <Button className='buttonNext' variant='primary' size='sm' onClick={this.clickHandler} >Suivant</Button>
            </div>
        </div>
      )
  };

}

export default chapitre;
