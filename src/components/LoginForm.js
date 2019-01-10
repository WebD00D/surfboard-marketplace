import React, { Component } from "react";
import Link from "gatsby-link";
import { Route, Redirect } from "react-router-dom";

import "../layouts/css/login.css";
import "../layouts/css/button.css";

import fire from "../fire";
import { connect } from "react-redux";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      email: "",
      password: "",
      signedIn: false,
      signInError: "",
      isShop: false
    };
  }

  handleClick() {
  
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        function(user) {
          // let's check if we are a shop.
          let userId = user.uid;
          fire
            .database()
            .ref("/users/" + user.uid)
            .once("value")
            .then(
              function(snapshot) {
                fire
                  .database()
                  .ref(`shops/${snapshot.val().shop_coast}/${userId}`)
                  .once("value")
                  .then(
                    function(shopData) {
                      console.log("shop data", shopData.val());
                      console.log("user data", snapshot.val());

                      let user = snapshot.val();
                      let shop = shopData.val();

                      this.props.setCurrentUser(
                        userId,
                        user.username,
                        user.email,
                        user.paypal_email,
                        user.shop_coast,
                        shop.shop_name,
                        shop.shop_city,
                        shop.shop_phone,
                        shop.shop_state,
                        shop.shop_website
                      );


                    }.bind(this)
                  );
              }.bind(this)
            );
        }.bind(this)
      )
      .catch(
        function(error) {
          console.log(error.message);
          this.setState({
            signInError: error.message
          });
        }.bind(this)
      );
  }

  componentWillMount() {

  }

  render() {

    return (
      <div className="login-form">

        <div className="login-form__field">
          <label>Email</label>
          <input
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
            type="text"
          />
        </div>
        <div className="login-form__field">
          <label>Password</label>
          <input
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
            type="password"
          />
          <div className="f-11 fc-red t-sans">{this.state.signInError}</div>
        </div>
        <div className="login-form__actions">
          <button
            onClick={this.handleClick}
            className="button button--green button--large"
          >
            Sign In
          </button>
          <div className="login-form__seperator">
            <div className="login-form__seperator__line" />
            <div className="login-form__seperator__text">Or</div>
          </div>
          <Link to="/create-account">
            <button className="button button--black button--large">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userId, shop_name }) => {
  return { userId, shop_name };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: (
      id,
      username,
      email,
      paypal,
      coast,
      shopName,
      shopCity,
      shopPhone,
      shopState,
      shopWebsite
    ) =>
      dispatch({
        type: `SET_CURRENT_USER`,
        user: id,
        username: username,
        email: email,
        paypal: paypal,
        coast: coast,
        shop: shopName,
        shopCity: shopCity,
        shopPhone: shopPhone,
        shopState: shopState,
        shopWebsite: shopWebsite
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
