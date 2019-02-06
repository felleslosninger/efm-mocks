import React from 'react';
import './Sidebar.css';
import {NavLink} from "react-router-dom";

export default class Sidebar extends React.Component {

    state = {};

    render(){
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">

                            <NavLink to='/' exact activeClassName="active" className="nav-link" >
                                <span data-feather="home"></span>
                                Incoming messages <span className="sr-only">(current)</span>
                            </NavLink>

                            <NavLink to='/' exact activeClassName="active" className="nav-link" >
                                <span data-feather="home"></span>
                                Outgoing messages <span className="sr-only">(current)</span>
                            </NavLink>


                            {/*<NavLink to='/' exact activeClassName="active" className="nav-link" >*/}
                                {/*<span data-feather="home"></span>*/}
                                {/*DPO<span className="sr-only">(current)</span>*/}
                            {/*</NavLink>*/}


                        </li>
                        {/*<li className="nav-item">*/}

                            {/*<NavLink to='/new' exact activeClassName="active" className="nav-link" >*/}
                                {/*<span data-feather="home"></span>*/}
                                {/*Ny melding <span className="sr-only">(current)</span>*/}
                            {/*</NavLink>*/}


                        {/*</li>*/}
                    </ul>

                    {/*<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">*/}
                        {/*<span>Saved reports</span>*/}
                        {/*<a className="d-flex align-items-center text-muted" href="#">*/}
                            {/*<span data-feather="plus-circle"></span>*/}
                        {/*</a>*/}
                    {/*</h6>*/}
                    {/*<ul className="nav flex-column mb-2">*/}
                        {/*<li className="nav-item">*/}
                            {/*<a className="nav-link" href="#">*/}
                                {/*<span data-feather="file-text"></span>*/}
                                {/*Current month*/}
                            {/*</a>*/}
                        {/*</li>*/}
                        {/*<li className="nav-item">*/}
                            {/*<a className="nav-link" href="#">*/}
                                {/*<span data-feather="file-text"></span>*/}
                                {/*Last quarter*/}
                            {/*</a>*/}
                        {/*</li>*/}
                        {/*<li className="nav-item">*/}
                            {/*<a className="nav-link" href="#">*/}
                                {/*<span data-feather="file-text"></span>*/}
                                {/*Social engagement*/}
                            {/*</a>*/}
                        {/*</li>*/}
                        {/*<li className="nav-item">*/}
                            {/*<a className="nav-link" href="#">*/}
                                {/*<span data-feather="file-text"></span>*/}
                                {/*Year-end sale*/}
                            {/*</a>*/}
                        {/*</li>*/}
                    {/*</ul>*/}
                </div>
            </nav>
        );
    }
}