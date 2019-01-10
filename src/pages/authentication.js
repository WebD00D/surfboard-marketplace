import React, { PureComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import fire from "../fire";
import "../layouts/css/site.css";

import { connect } from "react-redux";

class Authentication extends PureComponent {
  constructor(props) {
    super(props);
    this._handleSignup = this._handleSignup.bind(this);
    this._handleSignIn = this._handleSignIn.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      newUser: false,
      returningUser: false,
      loading: false,
      error: ''

    };
  }

  _handleSignIn() {

    this.setState({ loading: true });

    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        function(user) {
          fire
            .database()
            .ref("users/" + user.uid)
            .once("value")
            .then(
              function(snapshot) {
                console.log("SIGN IN SNAPSHOT", snapshot.val());
                document.cookie = "boardgrab_user" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = `boardgrab_user=${user.uid}`;

                localStorage.setItem('boardgrab_user', user.uid);

                this.props.setCurrentUser(
                  user.uid,
                  snapshot.val().username,
                  snapshot.val().email,
                  snapshot.val().hasNotifications,
                  snapshot.val().paypal_email,
                  snapshot.val().seller,
                  snapshot.val().stripe
                );
              }.bind(this)
            );
        }.bind(this)
      )
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("LOGIN ERROR", errorCode, errorMessage);
        this.setState({
          error: errorMessage
        })
        // ...
      }.bind(this));
  }

  _handleSignup() {
    this.setState({
      loading: true,
      newUser: true
    });

    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        function(user) {
          const newUser = fire.auth().currentUser;

          localStorage.setItem('boardgrab_user', user.uid);


          this.props.createAndSignInUser(
            user.uid,
            this.state.username,
            this.state.email
          );

          fetch(
            `https://boardgrab-api.herokuapp.com/send-welcome-email?email=${
              this.state.email
            }`
          ).then(function(response) {
            console.log("RESPONSE", response);
          });
        }.bind(this)
      )
      .catch(function(error) {
        // handle errors.
        const errorCode = error.code;
        const errorMessage = error.message;
        this.setState({
          error: errorMessage
        })
      }.bind(this));
  }

  render() {
    if (this.props.userAuthenticated && this.state.newUser) {
      return <Redirect to="/welcome-to-boardgrab" />;
    }

    if (this.props.userAuthenticated && !this.state.newUser) {
      return <Redirect to="/" />;
    }

    return (
      <div>
      <div className="page-header">
          <b className="t-sans">Welcome. Aloha. Benvenuto.</b>
      </div>
      <div className="site-container--sm t-primary" style={{paddingTop: '0px'}}>

        <div style={{width: '100%', marginBottom: '30px', backgroundColor: '#EC644B', color: '#FFFFFF', fontSize: '12px', borderRadius: '6px', textAlign: 'center' }}>{this.state.error}</div>

        <div className="authentication-header">Sign in </div>
        <label className="authentication-label">Email</label>
        <input
          className="authentication-field"
          onChange={e => {
            this.setState({ email: e.target.value });
          }}
          type="text"
        />
        <label className="authentication-label">Password</label>
        <input
          className="authentication-field"
          onChange={e => {
            this.setState({ password: e.target.value });
          }}
          type="password"
        />
        <button
          onClick={() => this._handleSignIn()}
          className="auth-button"
          style={{ marginTop: "22px" }}
        >
          Sign In
        </button>
        <hr />

        <div className="authentication-header">Create Account </div>
        <label className="authentication-label">Username</label>
        <input
          className="authentication-field"
          onChange={e => {
            this.setState({ username: e.target.value });
          }}
          type="text"
        />
        <label className="authentication-label">Email</label>
        <input
          className="authentication-field"
          onChange={e => {
            this.setState({ email: e.target.value });
          }}
          type="text"
        />
        <label className="authentication-label">Password</label>
        <input
          className="authentication-field"
          onChange={e => {
            this.setState({ password: e.target.value });
          }}
          type="password"
        />
        <button
          onClick={() => this._handleSignup()}
          className="auth-button auth-button--black"
          style={{ marginTop: "22px" }}
        >
          Submit
        </button>
      </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userId,
  userAuthenticated,
  account_username,
  firstTimeLogin
}) => {
  return { userId, userAuthenticated, account_username, firstTimeLogin };
};

const mapDispatchToProps = dispatch => {
  return {
    createAndSignInUser: (userId, account_username, email) =>
      dispatch({
        type: `CREATE_AND_SIGNIN_USER`,
        userId,
        account_username,
        email
      }),
    setCurrentUser: (
      userId,
      username,
      email,
      hasNotifications,
      paypal_email,
      seller,
      stripe
    ) =>
      dispatch({
        type: `SET_CURRENT_USER`,
        userId,
        username,
        email,
        hasNotifications,
        paypal_email,
        seller,
        stripe
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
