//import


//actions

const SAVE_TOKEN = 'SAVE_TOKEN';

//action creators

const saveToken = (token) => {
    return {
        type: SAVE_TOKEN,
        token
    }
}

//API actions

const facebookLogin = (access_token) => {
    return dispatch => {
        fetch('http://localhost:4000/users/facebookLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({access_token: access_token})
        })
            .then(response => response.json())
            .then(json => {
                if(json.token){
                    dispatch(saveToken(json.token))
                }
            })
            .catch(err => console.log(err))

    }
}

const generalLogin = (username, password) => {
    return dispatch => {
        fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({email: username, password: password})
        })
            .then(response => response.json())
            .then(json => {
                if(json.token){
                    dispatch(saveToken(json.token))
                }else{
                    alert('로그인 실패!')
                }
            })
            .catch(err => console.log(err))
    }
}

const createAccount = (username, password, email, fullname) => {
    return dispatch => {
        fetch('http://localhost:4000/users/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({email: email, password: password, username: username, fullname: fullname})
        })
            .then(response => response.json())
            .then(json => {
                if(json.token){
                    dispatch(saveToken(json.token))
                }else{
                    alert(json.text);
                }
            })
    }
}

//initial state

const initialState = {
    isLoggedIn: localStorage.getItem('jwt') || false

}

//reducer

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_TOKEN:
            return applySetToken(state, action);
        default : return state;
    }
}

//reducer func

const applySetToken = (state, action) => {
    const {token} = action;
    localStorage.setItem('jwt', token);
    return {
        ...state,
        isLoggedIn: true,
        token: token
    }
}

//exports
const actionCreators = {
    facebookLogin,
    generalLogin,
    createAccount
};

export {actionCreators};

export default reducer;