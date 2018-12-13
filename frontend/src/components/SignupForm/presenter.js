import React from 'react';
import FacebookLogin from 'react-facebook-login';
import styles from '../../shared/formStyles.scss';

const SignupForm = props => (
    <div className={styles.formComponent}>
        <h3 className={styles.signupHeader}>Sign up to see photos and videos from your friends.</h3>
        <FacebookLogin
            appId='252746428582593'
            autoLoad={false}
            fields='name,email,picture,gender,id'
            callback={props.handleFacebookLogin}
            cssClass={styles.facebookLink}
            icon='fa-facebook-official'
            textButton={'Login with Facebook'}
        />
       <span className={styles.divider}>or</span>
        <form className={styles.form} onSubmit={props.handleSubmit}>
            <input type="email" placeholder='Email' className={styles.textInput} name='email' value={props.email} onChange={props.handleChange}/>
            <input type="text" placeholder='Full Name' className={styles.textInput} name='fullname' value={props.fullname} onChange={props.handleChange}/>
            <input type="username" placeholder='Username' className={styles.textInput} name='username' value={props.username} onChange={props.handleChange}/>
            <input type="password" placeholder='Password' className={styles.textInput} name='password' value={props.password} onChange={props.handleChange}/>
            <input type="submit" value='Sign up' className={styles.button}/>
        </form>
        <p className={styles.terms}>
            By signing up, you agree to our <span>Terms & Privacy Policy</span>
        </p>
    </div>
);

export default SignupForm;
