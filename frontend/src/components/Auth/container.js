import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Auth from './presenter';

class Container extends Component {

    state = {
        action: 'login'
    };

    render() {
        const {action} = this.state;

        return <Auth action={action} changeAction={this._changeAction}/>
    }

    _changeAction = () => {

        this.setState(prevState => {
            const {action} = prevState;
            if(action === 'login'){
                return {
                    action: 'signup'
                }
            }else if(action ==='signup'){
                return {
                    action: 'login'
                }
            }
        })
    }
}

Container.propTypes = {};

export default Container;
