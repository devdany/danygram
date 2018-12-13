import React from 'react';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router-dom';
import styles from './styles.scss';
import Footer from '../Footer';
import Auth from '../Auth';

const App = props => [
    // Nav,
    props.isLoggedIn ?  <PrivateRoute key={2} /> : <PublicRoute key={2}/>,
    <Footer key={3} />
]

App.proptTypes = {
    isLoggedIn: PropTypes.bool.isRequired
}

const PrivateRoute = props => (
    <Switch>
        <Route exact path="/" render={() => "feed"} />
        <Route exact path="/explorer" render={() => "explorer"} />
    </Switch>
)

const PublicRoute = props => (
    <Switch>
        <Route exact path="/" component={Auth} />
        <Route exact path="/forgot" render={() => "password"} />
    </Switch>
)

export default App;
