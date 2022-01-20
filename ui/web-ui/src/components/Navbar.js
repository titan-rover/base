import React from 'react';
import { Component } from 'react';
import { NavLink} from "react-router-dom";
import '../css/NavBar.css'

class MyNavbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
                <div className="container">
                    <NavLink exact to ="/"className="nav-links">Titan Rover User Interface</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                {/* <a className="nav-link" href="https://controls.titanrover.com">2D Mode
                                <span className="sr-only">(current)</span>
                                </a> */}
                                <NavLink exact to ="/"className="nav-links"> 2D Mode </NavLink>
                            </li>
                            <li className="nav-item">
                                {/* <a className="nav-link" href="https://controls.titanrover.com/XR">XR Mode</a> */}
                                {/* <a className="nav-link" href="http://localhost:3000/XR">XR Mode</a> */}
                                <NavLink exact to ="/XR" className="nav-links"> XR </NavLink>
                            </li>
                            <li className="nav-item">
                                {/* <a className="nav-link" href="https://controls.titanrover.com">Science Mode</a> */}
                                {/* <a className="nav-link" href="http://localhost:3000/science">Science</a> */}
                                <div className="dropdown">
                                  <NavLink exact to ="/science" className="nav-links dropbtn"> Science </NavLink>
                                <div className="dropdown-content">
                                  <NavLink exact to ="/science" className="nav-links link"> Soil </NavLink>
                                  <NavLink exact to ="/fluid" className="nav-links link"> Fluid </NavLink>
                                </div>
                              </div>
                            </li>
                            <li className="nav-item">
                                {/* <a className="nav-link" href="https://controls.titanrover.com">Electricals Mode</a> */}
                                {/* <a className="nav-link" href="http://localhost:3000/electricals">Electricals Mode</a> */}
                                <NavLink exact to ="/electricals" className="nav-links"> Electricals </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default MyNavbar;
