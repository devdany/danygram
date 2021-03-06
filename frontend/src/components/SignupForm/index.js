import {connect} from 'react-redux';
import Container from './container';
import {actionCreators} from "../../redux/modules/user";

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        facebookLogin: (access_token) => {
            dispatch(actionCreators.facebookLogin(access_token))
        },
        createAccount: (username, password, email, fullname) => {
            dispatch(actionCreators.createAccount(username, password, email, fullname))
        }
    }
}

export default connect(null, mapDispatchToProps)(Container);