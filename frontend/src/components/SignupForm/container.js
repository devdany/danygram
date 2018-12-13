import React from 'react';
import SignupForm from './presenter';
import PropTypes from 'prop-types';

class Container extends React.Component{

    state = {
        email: '',
        fullname: '',
        username: '',
        password: ''
    }

    static propTypes = {
        facebookLogin: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired
    }


    _handleInputChange = (e) => {
        const {name, value} = e.target
        this.setState({
            [name]: value
        })
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        const {createAccount} = this.props;
        const {email, password, username, fullname} = this.state;

        createAccount(username, password, email, fullname);

    }

    _handleFacebookLogin = (res) => {
        const {facebookLogin} = this.props;
        facebookLogin(res.accessToken);
    }

    render(){
        return (
            <SignupForm
                {...this.props}
                handleChange={this._handleInputChange}
                handleSubmit={this._handleSubmit}
                handleFacebookLogin={this._handleFacebookLogin}
            />
        )
    }
}


export default Container;