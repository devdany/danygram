import React from 'react';
import styles from '../../shared/formStyles.scss';
import FacebookLogin from 'react-facebook-login';
import PropTypes from 'prop-types';

const LoginForm = props => (
    <div className={styles.formComponent}>
        <form className={styles.form} onSubmit={props.handleSubmit}>
            <input
                type='text'
                placeholder='Username'
                className={styles.textInput}
                value={props.usernameValue}
                onChange={props.handleInputChange}
                name='username'
            />
            <input
                type='password'
                placeholder='Password'
                className={styles.textInput}
                value={props.passwordValue}
                onChange={props.handleInputChange}
                name='password'
            />
            <input type='submit' value='Log in' className={styles.button}/>
        </form>
        <span className={styles.divider}>or</span>
        <FacebookLogin
            appId='252746428582593'
            autoLoad={false}
            fields='name,email,picture,gender,id'
            callback={props.handleFacebookLogin}
            cssClass={styles.facebookLink}
            icon='fa-facebook-official'
        />
        <span className={styles.forgotLink}>Forgot password?</span>
    </div>
);

LoginForm.propTypes = {
    usernameValue: PropTypes.string.isRequired,
    passwordValue: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleFacebookLogin: PropTypes.func.isRequired
}

export default LoginForm;