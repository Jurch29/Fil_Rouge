import React, { Component } from 'react';
import './chapitre.css';
import {Button} from 'react-bootstrap';
import axios from 'axios';
import history from '../history';

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
        this.clickHandlerPrevious = this._clickHandlerPrevious.bind(this);
        this.clickHandlerNext = this._clickHandlerNext.bind(this);
    }

    componentWillMount() {
        let self=this;
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
    _clickHandlerPrevious(){
        let self=this;
        axios({
            method: 'post',
            url: 'http://localhost:4000/getPreviousChapitre',
            data: {
                chapitre_id: self.state.idChapitre
            }
        })
        .then(res => {
            let result = res.data[0];
            if(result.body != null){
                this.setState({body:result.body})
                this.setState({titre:result.titre})
                this.setState({auteur:result.auteur})
                this.setState({idChapitre:result.id})
                this.componentWillMount()
            }
        })
        .catch(function(error) {
            history.push({
             pathname: '/acceuil'
            })
            console.log('error selectChapitre nonconnecte clickHandler '+error);
        });
    }

    _clickHandlerNext(){
       
            axios({
                method: 'post',
                url: 'http://localhost:4000/getNextChapitre',
                data: {
                    chapitre_id: this.state.idChapitre
                }
            })
            .then(res => {
                let result = res.data[0];
                if(result.body != null){
                    this.setState({body:result.body})
                    this.setState({titre:result.titre})
                    this.setState({auteur:result.auteur})
                    this.setState({idChapitre:result.id})
                    axios({
                        method: 'post',
                        url: 'http://localhost:4000/avancement',
                        data: {
                            user_id: this.state.Username,
                            idcours: this.state.idCours,
                            idChapitre: this.state.idChapitre
                        }
                    })
                    .then(function(result) { 
                    })
                    .catch(function(error) {
                        console.log('error chapite componentWillMount '+error);
                    });
                    this.componentWillMount()
                }
                   
            
            })
            .catch(function(error) {
                 history.push({
                  pathname: '/acceuil'
                 })
                console.log('error selectChapitre nonconnecte clickHandler '+error);
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
            <Button className='buttonNext' variant='primary' size='sm' onClick={this.clickHandlerPrevious} >Precedant</Button>
                <Button className='buttonNext' variant='primary' size='sm' onClick={this.clickHandlerNext} >Suivant</Button>
            </div>
        </div>
      )
  };

}

export default chapitre;
