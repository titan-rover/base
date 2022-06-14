import React, { Component } from 'react';
import {Container} from 'react-bootstrap';
import MyNavbar from './components/Navbar';

class Fluid extends Component {
    render() {
        return (
            <Container>
                <MyNavbar/>
                Something goes here
            </Container>
        );
    }
}

export default Fluid;
