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
import SentMessages from "./pages/SentMessages";

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
                          <Route exact path="/sent" component={SentMessages}/>
                      </div>
                  </Router>
              </div>
          </div>
        );
    }
}

export default App;