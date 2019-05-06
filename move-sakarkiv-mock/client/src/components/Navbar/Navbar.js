import React from 'react';
import './Navbar.css';
import ReactModal from 'react-modal';
import MessageForm from "../../pages/NewMessage/NewMessageModal/MessageForm";
import {Link} from "react-router-dom";

const modalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 100000
    },
    content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
    }
};

export default class Navbar extends React.Component {

    state = {};

    toggleNewMessage = () => {
        this.setState({
            showNewMessage: !this.state.showNewMessage
        });
    };

    render(){
        return (
            <nav className="navbar fixed-top  flex-md-nowrap p-0 shadow">


                <div className="navbar-header">
                    <Link to={'/'} className="mock-logo">
                        <img src="difi.jpg" />
                        <div className="logo-text">Sak/Arkiv mock</div>
                    </Link>
                </div>

                {/*<a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Move Sak/Arkiv</a>*/}

                {/*<img src="images/difi.jpg" />*/}

                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">

                        <button className="btn btn-sm btn-primary" onClick={this.toggleNewMessage}>New message</button>

                        {/*<a className="nav-link" href="#">Sign out</a>*/}
                    </li>
                </ul>

                <ReactModal
                    style={modalStyle}
                    isOpen={this.state.showNewMessage}
                    contentLabel="Minimal Modal Example"
                    onSave={this.showNewMessage}
                >
                    <MessageForm
                        dismiss={this.toggleNewMessage}
                    />
                </ReactModal>
            </nav>
        );
    }
}