import React, { Component } from 'react';
import  'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Sidebar from "./components/Sidebar/Sidebar";
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import ReactModal from 'react-modal';
import IncomingMessages from "./pages/IncomingMessages";
import Navbar from "./components/Navbar/Navbar";
import SentMessages from "./pages/SentMessages";
import Dashboard from "./pages/Dashboard";

ReactModal.setAppElement('#root');

const baseName = process.env.NODE_ENV === 'production' ? '/move-mocks/sa-mock' : '';

class App extends Component {
    render() {
        return (
            <Router basename={baseName}>
                <div>
                    <Navbar />
                    <div className="container-fluid">
                        <div className="row">
                            <Sidebar />
                            <Route exact path="/" component={Dashboard}/>
                            <Route exact path="/incoming" component={IncomingMessages}/>
                            <Route exact path="/sent" component={SentMessages}/>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;