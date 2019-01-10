import React, { Component } from "react";
import Link from "gatsby-link";
import { Route, Redirect } from "react-router-dom";
import fire from "../fire";
//import boardfax from "../boardfax";
import FatherTime from "../utils/fatherTime";

import { connect } from "react-redux";
import Moment from "react-moment";
import "whatwg-fetch";

import "../layouts/css/login.css";
import "../layouts/css/listing.css";
import "../layouts/css/tables.css";
import "../layouts/css/fcss.css";
import "../layouts/css/button.css";

class SellerConfirmation extends Component {
  constructor(props) {
    super(props);

    this.getCookie = this.getCookie.bind(this);
    this.getQueryVariable = this.getQueryVariable.bind(this);
  }

  componentDidMount() {
    // we should have a logged in user at this point.
    //const bgcookie = this.getCookie("boardgrab_user");
    const bgcookie = localStorage.getItem('boardgrab_user');

    if (bgcookie) {
      fire
        .database()
        .ref("users/" + bgcookie)
        .once("value")
        .then(
          function(snapshot) {
            console.log("SIGN IN SNAPSHOT", snapshot.val());
            this.props.setCurrentUser(
              bgcookie,
              snapshot.val().username,
              snapshot.val().email,
              snapshot.val().hasNotifications,
              snapshot.val().paypal_email,
              snapshot.val().seller
            );
          }.bind(this)
        )
        .then(
          function() {
            // handle the api request to officially register the user..

            const code = this.getQueryVariable("code");

            if (code) {

              fetch(
                `https://boardgrab-api.herokuapp.com/send-new-seller-email?email=${
                  this.props.currentUserEmail
                }`
              ).then(function(response) {
                console.log("RESPONSE", response);
              });

              fetch(
                `https://boardgrab-api.herokuapp.com/stripe-registration?code=${
                  code
                }`
              )
                .then(function(response) {
                  return response.json();
                })
                .then(
                  function(r) {
                    console.log("parsed json from stripe-registration", r);

                    let s = JSON.parse(r.text);
                    //  console.log("SAVE THIS STRIPE USER ID!!!!!!!", s.stripe_user_id);

                    let updates = {};
                    updates["users/" + this.props.userId + "/seller"] = true;
                    updates["users/" + this.props.userId + "/stripe"] =
                      s.stripe_user_id;

                    fire
                      .database()
                      .ref()
                      .update(updates);

                    // UPDATE STATE..
                    this.props.updateSellerInfo(true, s.stripe_user_id);
                  }.bind(this)
                )
                .catch(function(ex) {
                  console.log("parsing failed", ex);
                });
            } else {
              console.log("NO CODE!");
            }
          }.bind(this)
        );
    }
  }

  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  render() {
    return (
      <div>
      <div className="page-header">
          <b className="t-sans">Success!</b>
      </div>
      <div className="site-container--sm">
        <div>
          <div>
            <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
              Welcome to the Boardgrab selling community. The go-to place for
              surfers around the country to sell their boards for some extra
              spending money.
            </p>
            <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
              Now that you are ready to start selling, here are a couple handy
              Tips:
            </p>
            <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
              To view your current balance, go to your Boardgrab account page,
              click Settings, click “Stripe Dashboard”. This is how you view
              your Boardgrab payout history (Proceeds from the boards you have
              sold”) as well as update bank info.
            </p>
          </div>
          <Link to="/sell-a-board" className="fc-green">
            {" "}
            Click here to sell your first board!
          </Link>
        </div>
      </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userId, shop_coast, dropDownCityList, currentUserEmail }) => {
  return { userId, shop_coast, dropDownCityList, currentUserEmail };
};

const mapDispatchToProps = dispatch => {
  return {
    setListingCities: region =>
      dispatch({ type: `SET_LISTING_CITIES`, region }),
    setCurrentUser: (
      userId,
      username,
      email,
      hasNotifications,
      paypal_email,
      seller
    ) =>
      dispatch({
        type: `SET_CURRENT_USER`,
        userId,
        username,
        email,
        hasNotifications,
        paypal_email,
        seller
      }),
    updateSellerInfo: (seller, stripe) =>
      dispatch({ type: `SET_NEW_SELLER_INFO`, seller, stripe })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerConfirmation);
