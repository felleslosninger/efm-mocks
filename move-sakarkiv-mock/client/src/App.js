import React, { Component } from 'react';
import  'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Sidebar from "./components/Sidebar/Sidebar";
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import ReactModal from 'react-modal';
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import NewMessage from "./pages/NewMessage/NewMessage";
import dpe from "./pages/dpe";


let messages = [
    {
        title: 'melding 1'
    }
];

ReactModal.setAppElement('#root');

class App extends Component {
    render() {
        return (
          <div>
              <Navbar />
              <div className="container-fluid">
                  <Router>
                      <div className="row">
                          <Sidebar />
                          <Route exact path="/" component={Dashboard}/>
                          <Route exact path="/new" component={NewMessage}/>
                          <Route exact path="/dpe" component={dpe}/>


                      </div>
                  </Router>
                  </div>
          </div>
        );
    }
}

export default App;
