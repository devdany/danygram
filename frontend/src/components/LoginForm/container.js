import React, {Component} from 'react';
import LoginForm from './presenter';
import PropTypes from 'prop-types';


class Container extends Component {
    state = {
        username: '',
        password: ''
    };

    static propTypes = {
        facebookLogin: PropTypes.func.isRequired,
        generalLogin: PropTypes.func.isRequired
    }

    render() {
        const {username, password} = this.state;
        return (
            <LoginForm
                handleSubmit = {this._handleSubmit}
                handleInputChange={this._handleInputChange}
                handleFacebookLogin = {this._handleFacebookLogin}
                usernameValue={username}
                passwordValue={password}
            />
        );
    }

    _handleInputChange = e => {
        const {target : {value, name}} = e;
        this.setState({
            [name]: value
        })
    }

    _handleSubmit = e => {
        e.preventDefault();
        const {generalLogin} = this.props;
        const {username, password} = this.state;
        generalLogin(username, password);
        this.setState({
            username: '',
            password: ''
        })

    }

    _handleFacebookLogin = (res) => {
        const {facebookLogin} = this.props;
        facebookLogin(res.accessToken);
    }

}


export default Container;
