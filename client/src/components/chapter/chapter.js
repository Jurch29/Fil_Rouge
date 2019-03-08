import React, { Component } from 'react';
import './chapter.css';
import {Button} from 'react-bootstrap';
import axios from 'axios';
import history from '../history';

class Chapter extends Component {
    constructor(props) {
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
            is_last: '',
            is_first: ''
        }
        this.clickHandlerPrevious = this._clickHandlerPrevious.bind(this);
        this.clickHandlerNext = this._clickHandlerNext.bind(this);
    }

    componentWillMount() {
        let self=this;
        axios({
            method: 'post',
            url: 'http://localhost:4000/getSubjectChaptersList',
            data: {
                subject_id: self.state.idCours
            }
        })
        .then(function(result) {
            result = result.data;
            let data = [result.length];
            let iLecture=0,conteur=0;
            result.sort(compare);
            function compare(elementA,elementB){
                if(elementA[0].titre < elementB[0].titre)
                    return-1;
                if(elementA[0].titre > elementB[0].titre)
                    return 1;
                return 0;
            }
            while(iLecture < result.length) {
                if(result[iLecture][0].titre===self.state.titre){
                    data[iLecture] = <li key={conteur++} className="Chapitreactuel">{result[iLecture][0].titre}</li>;
                }else{
                    data[iLecture] = <li key={conteur++}>{result[iLecture][0].titre}</li>;
                }
                iLecture ++;
            }
            self.setState({menu :data});
            self.isFirst();
            self.isLast();
        })
        .catch(function(error) {
            console.log('error chapter componentWillMount '+error);
        });
    }

    isFirst() {
        let self=this;
        axios({
            method: 'post',
            url: 'http://localhost:4000/getPreviousChapter',
            data: {
                chapter_id: self.state.idChapitre
            }
        })
        .then(res => {
            let result = res.data[0];
            if(result != null){
                this.setState({is_first : <Button className='buttonNext' variant='primary' size='sm' onClick={this.clickHandlerPrevious} >Precedant</Button>});
            } else {
                this.setState({is_first : ''});
            }
        })
        .catch(function(error) {
            console.log('error selectChapter nonconnecte clickHandler '+error);
        });
    }


    isLast() {
        let self=this;
        axios({
            method: 'post',
            url: 'http://localhost:4000/getNextChapter',
            data: {
                chapter_id: self.state.idChapitre
            }
        })
        .then(res => {
            let result = res.data[0];
            if(result != null){
                this.setState({is_last : <Button className='buttonNext' variant='primary' size='sm' onClick={this.clickHandlerNext} >Suivant</Button>});
            } else {
                this.setState({is_last : ''});
            }
        })
        .catch(function(error) {
            console.log('error selectChapter nonconnecte clickHandler '+error);
        });
    }

    _clickHandlerPrevious(){
        let self=this;
        axios({
            method: 'post',
            url: 'http://localhost:4000/getPreviousChapter',
            data: {
                chapter_id: self.state.idChapitre
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
                pathname: '/home'
            })
            console.log('error selectChapter nonconnecte clickHandler '+error);
        });
    }

    _clickHandlerNext(){
       
            axios({
                method: 'post',
                url: 'http://localhost:4000/getNextChapter',
                data: {
                    chapter_id: this.state.idChapitre
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
                        url: 'http://localhost:4000/advancement',
                        data: {
                            user_id: this.state.Username,
                            subject_id: this.state.idCours,
                            chapter_id: this.state.idChapitre
                        }
                    })
                    .then(function(result) { 
                    })
                    .catch(function(error) {
                        console.log('error chapter componentWillMount '+error);
                    });
                    this.componentWillMount()
                }
                   
            })
            .catch(function(error) {
                history.push({
                    pathname: '/home'
                })
                console.log('error selectChapter nonconnecte clickHandler '+error);
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
                {this.state.is_first}
                {this.state.is_last}
            </div>
        </div>
      )
  };

}

export default Chapter;
