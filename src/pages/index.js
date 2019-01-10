import React, { PureComponent } from "react";
import Link from "gatsby-link";
import fire from "../fire";
import { Route, Redirect } from "react-router-dom";
import MapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import cx from "classnames";
import _ from "lodash";

import { connect } from "react-redux";

import CityPin from "../components/CityPin";
import Board from "../components/Board";
import BoardFlyout from "../components/BoardFlyOut";

import "../layouts/css/filters.css";
import "../layouts/css/site.css";
import "../layouts/css/fcss.css";
import "../layouts/css/board.css";

import CITIES from "../data/cities.json";

class IndexPage extends PureComponent {
  constructor(props) {
    super(props);

    this.handleCityChange = this.handleCityChange.bind(this);
    this._updateDims = this._updateDims.bind(this);
    this._handleBoardClick = this._handleBoardClick.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.checkAccess = this.checkAccess.bind(this);

    this.state = {
      popupInfo: null,
      width: 0,
      height: 0,
      flyout: false,
      board: 0,
      bestForMenuOpen: false,
      mobileLocationMenu: false,
      mobileLocationTitle: "All Locations",
      accessGranted: true
    };
  }

  componentWillMount() {
    // check if user is signed in ..
    // end check if user is signed in..
  }

  checkAccess(value) {
    if (value === "KellySl8ter69!") {
      this.props.allowAccess();
    }
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

  componentDidMount() {
    //const bgcookie = this.getCookie("boardgrab_user");

    const bgcookie = localStorage.getItem("boardgrab_user");

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
        );
    }

    this._updateDims();
    window.addEventListener("resize", this._updateDims);

    // GET ALL BOARDS
    fire
      .database()
      .ref("/allBoardsList/boards")
      .once("value")
      .then(
        function(snapshot) {
          console.log("BOARDS", snapshot.val());
          this.props.getAllBoards(snapshot.val());
        }.bind(this)
      );

    // GET ALL BOARDS BY REGION
    fire
      .database()
      .ref("/boardsByRegion/")
      .once("value")
      .then(
        function(snapshot) {
          console.log("BOARDS BY REGION", snapshot.val());
          this.props.getAllBoardsByRegion(snapshot.val());
        }.bind(this)
      );

    // GET ALL BOARDS BY CITY
    fire
      .database()
      .ref("/boardsByCity/")
      .once("value")
      .then(
        function(snapshot) {
          console.log("BOARDS BY CITY", snapshot.val());
          this.props.getAllBoardsByCity(snapshot.val());
        }.bind(this)
      );
  }

  _updateDims() {
    if (document.getElementById("map")) {
      const containerWidth = document.getElementById("map").clientWidth;
      this.setState({
        width: containerWidth,
        height: window.innerHeight
      });
    }
  }

  _renderBoards = (board, index) => {
    return (
      <Board
        key={`boards-${index}`}
        board={board}
        onClick={() => {
          this.setState({
            flyout: true,
            board: board.id
          });
        }}
      />
    );
  };

  _renderCityMarker = (city, index) => {
    console.log(city, index);
    return;
    return (
      <Marker
        key={`marker-${index}`}
        longitude={city.longitude}
        latitude={city.latitude}
      >
        <CityPin
          size={20}
          boardCount={city.boards.length}
          onClick={() => this.handleCityChange(city.name)}
        />
      </Marker>
    );
  };

  handleCityChange(city) {
    this.props.setCityData(city);
  }

  _handleBoardClick(board) {
    console.log("HANDLE BOARD", board);
    this.setState({
      board: board,
      flyout: true
    });
  }

  render() {
    return (
      <div id="container">
        <div className="hp-hero">
          <div className="hp-hero__title">
            It's never been easier to <br /> buy and sell a used bike
          </div>
          <img
            className="hp-hero__wave"
            src={require("../layouts/images/Wave_White@2x.png")}
          />
          <div className="hp-copy fc-white m-b-20">Watch our Video.</div>
          <img
            className="hover hp-hero__play"
            src={require("../layouts/images/playicon.png")}
          />
        </div>
        <div className="hp-alert-bar">
          <b style={{ paddingRight: "4px" }}>WIN A SURFBOARD! </b> List a board
          by April 30th, and get double entries into the contest.{" "}
          <span
            className="hover"
            style={{ textDecoration: "underline", paddingLeft: "4px" }}
          >
            Enter Here.
          </span>
        </div>

        <section className="hp-section">
          <div className="hp-section__header t-sans">
            A peer to peer marketplace <br />
            helping bikes find new homes.
          </div>
          <div className="hp-section__copy hp-copy">
            Tired of paying massive commisions to a third party, or dealing with
            the shady nuances of Craigslist? So were we. Enter Bikegrab, the
            best place to buy and sell used bikes.
          </div>
        </section>

        <section className="hp-section hp-section__features">
          <div className="hp-features">
            <div className="hp-feature">
              <img src={require("../layouts/images/credit_card@2x.png")} />
              <div className="hp-feature__spacer" />
              <div className="t-sans f-16">
                <b>SECURE PAYMENTS</b>
              </div>
              <div className="t-sans f-16">
                Pay for your bike on Bikegrab. Recieve payouts via Stripe.
              </div>
            </div>

            <div className="hp-feature">
              <img src={require("../layouts/images/mappin@2x.png")} />
              <div className="hp-feature__spacer" />
              <div className="t-sans f-16">
                <b>EASY SEARCH</b>
              </div>
              <div className="t-sans f-16">
                Using our map feature, finding your next bike will be a breeze.
              </div>
            </div>
            <div className="hp-feature">
              <img src={require("../layouts/images/community@2x.png")} />
              <div className="hp-feature__spacer" />
              <div className="t-sans f-16">
                <b>COMMUNITY DRIVEN</b>
              </div>
              <div className="t-sans f-16">
                Messaging and comments let you nerd out even more on the stoke.
              </div>
            </div>
          </div>
        </section>

        <section className="hp-section hp-section__sell ">
          <div className="hp-section__sell-caption">
            <label className="t-sans">MAKE SOME CASH</label>
            <div className="hp-section__sell-title t-sans">
              Sell Your Bike
            </div>
            <img
              className="hp-sell_waves"
              src={require("../layouts/images/Waves_Black@2x.png")}
            />
          </div>
          <div className="hp-sell_info t-sans fc-white">
            We’ve made it super simple to sell your used bikes . In your
            seller’s dashboard, you’ll be able to manage your listings, accept
            offers, answer questions, view payouts, and more.
          </div>
          <img
            className="hp-sell_img"
            src={require("../layouts/images/SellBoardPhoto@2x.png")}
          />
          <div className="hp-sell__cta t-sans hover">
            Create Seller Profile <i className="fa fa-long-arrow-right" />
          </div>
        </section>

        <section className="hp-section hp-section__sell ">
          <div className="hp-section__sell-caption">
            <label className="t-sans">ADD TO YOUR QUIVER</label>
            <div className="hp-section__sell-title t-sans">
              Find Your Next
            </div>
            <img
              className="hp-sell_waves"
              src={require("../layouts/images/Waves_Black@2x.png")}
            />
          </div>
          <div className="hp-sell_info t-sans fc-white">
          See a bike you’re keen on? Cool - send the seller an offer, or ask
          a question. You’ll be able to pay securely for the bike on our site
          via Stripe, view purchases, message history, and more.
          </div>
          <img
            className="hp-sell_img"
            src={require("../layouts/images/BuyBoardPhoto@2x.png")}
          />
          <div className="hp-sell__cta t-sans hover">
            Create an Account <i className="fa fa-long-arrow-right" />
          </div>
        </section>


      </div>
    );
  }
}

const mapStateToProps = ({
  userId,
  latitude,
  longitude,
  regions,
  mapZoom,
  citesByRegion,
  boardsByCity,
  allBoardsList,
  boardsToDisplay,
  account_username,
  selectedCity,
  regionHasNoBoards,
  selectedRegion,
  isSeller,
  userAuthenticated,
  accessGranted
}) => {
  return {
    userId,
    latitude,
    longitude,
    regions,
    mapZoom,
    citesByRegion,
    boardsByCity,
    allBoardsList,
    boardsToDisplay,
    account_username,
    selectedCity,
    regionHasNoBoards,
    selectedRegion,
    isSeller,
    userAuthenticated,
    accessGranted
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMapPosition: (latitude, longitude) =>
      dispatch({ type: `SET_MAP_POSITION`, latitude, longitude }),
    setCityData: city => dispatch({ type: `SET_CITY_DATA`, city }),
    setRegionData: region =>
      dispatch({ type: `SET_REGION_AND_CITIES`, region }),
    getAllBoards: boards => dispatch({ type: `GET_ALL_BOARDS`, boards }),
    getAllBoardsByRegion: boards =>
      dispatch({ type: `GET_ALL_BOARDS_BY_REGION`, boards }),
    getAllBoardsByCity: boards =>
      dispatch({ type: `GET_ALL_BOARDS_BY_CITY`, boards }),
    allowAccess: () => dispatch({ type: `ALLOW_ACCESS` }),
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
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
