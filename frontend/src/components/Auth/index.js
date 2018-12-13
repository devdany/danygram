import {connect} from 'react-redux';
import Container from './container';
import React from 'react';

// Add all the actions for:
// Log in
// Sign up
// Recover password
// Check usersname
// Check password
// Check email

const mapStateToProps = (state, ownProps) => {
    const {user} = state;
    return {
        isLoggedIn: user.isLoggedIn
    }
};

export default connect()(Container);

