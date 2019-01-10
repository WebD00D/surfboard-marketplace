import React, { PureComponent } from "react";
import Link from "gatsby-link";

import LoginForm from "../components/LoginForm";
import "../layouts/css/fcss.css";

import fire from "../fire";
import { connect } from "react-redux";


class IndexPage extends PureComponent {
  constructor(props) {
    super(props);
    this.handleShopRegistration = this.handleShopRegistration.bind(this);

    //     fire.auth().signOut().then(function() {
    //   console.log('Signed Out');
    // }, function(error) {
    //   console.error('Sign Out Error', error);
    // });

    var u = fire.auth().currentUser;
    console.log("SIGNED IN USER", u);

    this.state = {
      uid: "",
      email: "",
      username: "",
      password: "",
      shop_name: "",
      shop_city: "",
      shop_state: "",
      shop_website: "",
      shop_phone: "",
      paypal_email: "",
      shop_coast: ""
    };
  }

  handleShopRegistration() {
    let db = fire.database();

    console.log(
    'account_user: ', this.state.username,
    '  shop_name: ', this.state.shop_name,
    '  shop_city: ' , this.state.shop_city,
    '  shop_state: ', this.state.shop_state,
    '  shop_website: ', this.state.shop_website,
    '  shop_phone: ', this.state.shop_phone
    )


    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const paypal_email = this.state.paypal_email;
    const shop_coast = this.state.shop_coast;
    const shop_name = this.state.shop_name;
    const shop_city = this.state.shop_city;
    const shop_state = this.state.shop_state;
    const shop_website = this.state.shop_website;
    const shop_phone = this.state.shop_phone;


    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(user) {
        // var u = fire.auth().currentUser;
        // console.log("SIGNED IN USER", u)

        // set user info..
        fire.database().ref(`users/${user.uid}`).set({
          username: username,
          email: email,
          paypal_email: paypal_email,
          isShop: true,
          shop_coast: shop_coast
        }).then(function(){
          // set shop info
          fire.database().ref(`shops/${shop_coast}/${user.uid}`).set({
            account_user: username,
            shop_name: shop_name,
            shop_city: shop_city,
            shop_state: shop_state,
            shop_website: shop_website,
            shop_phone: shop_phone
          });
        });

      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  render() {
    return (
      <div className="create-account">
        <div className="create-account__headline m-b-10">Create Shop Account </div>
        <Link to="/" className="td-none t-sans fc-green f-11 ">I've already got an account</Link>
        <div className="login-form__field m-t-30">
          <div className="login-form__field">
            <label>Email </label>
            <input
              name="email"
              onChange={e => {
                this.setState({ email: e.target.value });
              }}
              type="text"
            />
          </div>
          <label>Username </label>
          <input
            name="username"
            onChange={e => {
              this.setState({ username: e.target.value });
            }}
            type="text"
          />
        </div>
        <div className="login-form__field">
          <label>Password </label>
          <input
            name="password"
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
            type="password"
          />
        </div>
        <div className="login-form__seperator">
          <div className="login-form__seperator__line" />
        </div>
        <div className="login-form__field">
          <label>Shop Name </label>
          <input
            name="shopname"
            onChange={e => {
              this.setState({ shop_name: e.target.value });
            }}
            type="text"
          />
        </div>
        <div className="login-form__field">
          <label>Shop City </label>
          <input
            onChange={e => {
              this.setState({ shop_city: e.target.value });
            }}
            type="text"
          />
        </div>
        <div className="login-form__field">
          <label>Shop State </label>
          <select
            onChange={e => {
              var index = e.target.selectedIndex;
              var optionElement = e.target.childNodes[index]
              var option =  optionElement.getAttribute('data-coast');
              this.setState({
                shop_state: e.target.value,
                shop_coast: option
              });
            }}
          >
            <option value="NONE" />
            <option data-coast="west" value="CA">California</option>
            <option data-coast="east" value="CT">Connecticut</option>
            <option data-coast="east" value="DE">Delaware</option>
            <option data-coast="east" value="FL">Florida</option>
            <option data-coast="east" value="GA">Georgia</option>
            <option data-coast="east" value="ME">Maine</option>
            <option data-coast="east" value="MD">Maryland</option>
            <option data-coast="east" value="MA">Massachusettes</option>
            <option data-coast="east" value="NH">New Hampshire</option>
            <option data-coast="east" value="NJ">New Jersey</option>
            <option data-coast="east" value="NY">New York</option>
            <option data-coast="east" value="NC">North Carolina</option>
            <option data-coast="west" value="OR">Oregon</option>
            <option data-coast="east" value="RI">Rhode Island</option>
            <option data-coast="east" value="SC">South Carolina</option>
            <option data-coast="east" value="VA">Virginia</option>
            <option data-coast="west" value="WA">Washington</option>
          </select>
        </div>
        <div className="login-form__seperator">
          <div className="login-form__seperator__line" />
        </div>
        <div className="login-form__field">
          <label>Shop Website </label>
          <input
            onChange={e => {
              this.setState({ shop_website: e.target.value });
            }}
            type="text"
          />
        </div>
        <div className="login-form__field">
          <label>Phone Number </label>
          <input
            onChange={e => {
              this.setState({ shop_phone: e.target.value });
            }}
            type="text"
          />
        </div>
        <div className="login-form__seperator">
          <div className="login-form__seperator__line" />
        </div>
        <div className="login-form__field">
          <label>Paypal Email Address </label>
          <input
            onChange={e => {
              this.setState({ paypal_email: e.target.value });
            }}
            type="text"
          />
        </div>
        <button
          onClick={this.handleShopRegistration}
          className="button button--green button--large"
        >
          Create Account
        </button>
      </div>
    );
  }
}


const mapStateToProps = ({ userId }) => {
  return { userId }
}

export default connect(mapStateToProps)(IndexPage)
