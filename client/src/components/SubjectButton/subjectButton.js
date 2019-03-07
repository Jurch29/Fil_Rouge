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
    this.props.click(this.state.id, this.state.label);
  }

  render() {
    return (
        <Button className='buttonSubject' variant='success' size='lg' disabled={this.state.disabled} onClick={this.clickHandler} >{this.state.label}</Button> 
    );
  }
}

export default SubjectButton;
