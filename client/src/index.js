import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Popup from 'react-popup';
import App from './App';


ReactDOM.render(<Popup/>, document.getElementById("popup"));
ReactDOM.render(<App />, document.getElementById('root'));