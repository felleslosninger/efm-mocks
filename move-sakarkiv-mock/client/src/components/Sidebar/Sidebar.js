import React from 'react';
import './Sidebar.css';
import {NavLink} from "react-router-dom";

export default class Sidebar extends React.Component {
    render(){
        return (
            <nav className="col-md-2 d-none d-md-block sidebar">
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <NavLink to='/incoming' exact activeClassName="active" className="nav-link" >
                                <span data-feather="home" />
                                Incoming messages <span className="sr-only">(current)</span>
                            </NavLink>
                            <NavLink to='/sent' exact activeClassName="active" className="nav-link" >
                                <span data-feather="home" />
                                Outgoing messages
                                <span className="sr-only">(current)</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}