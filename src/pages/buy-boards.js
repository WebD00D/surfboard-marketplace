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
      accessGranted: true,
    };
  }

  componentWillMount() {
    // check if user is signed in ..



    // end check if user is signed in..
  }

  checkAccess(value) {


    if ( value === "KellySl8ter69!" ) {

      this.props.allowAccess()


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
    let boards;

    if (!this.props.boardsToDisplay || this.props.boardsToDisplay.length == 0) {
      if (!this.props.boardsToDisplay) {
        boards = (
          <div
            className="t-sans"
            style={{
              minHeight: "300px",
              paddingBottom: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <div style={{ marginBottom: "13px" }}>
              <b>No Boards Found!</b>
            </div>
            <div style={{ marginBottom: "13px" }}>
              Why not be the first to sell?
            </div>
            {this.props.isSeller ? (
              <Link className="auth-button" to="/sell-a-board">
                list a board
              </Link>
            ) : (
              ""
            )}
            {this.props.userAuthenticated && !this.props.isSeller ? (
              <Link className="auth-button" to="/sell-with-us">
                Start selling
              </Link>
            ) : (
              ""
            )}
            {!this.props.userAuthenticated ? (
              <Link className="auth-button" to="/authentication">
                Create Account
              </Link>
            ) : (
              ""
            )}
          </div>
        );
      } else {
        boards = (
          <div
            className="t-sans"
            style={{
              minHeight: "300px",
              paddingBottom: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <div style={{ marginBottom: "13px" }}>
              <b>No Boards Found!</b>
            </div>
            <div style={{ marginBottom: "13px" }}>
              Why not be the first to sell?
            </div>
            {this.props.isSeller ? (
              <Link className="auth-button" to="/sell-a-board">
                list a board
              </Link>
            ) : (
              ""
            )}
            {this.props.userAuthenticated && !this.props.isSeller ? (
              <Link className="auth-button" to="/sell-with-us">
                Start selling
              </Link>
            ) : (
              ""
            )}
            {!this.props.userAuthenticated ? (
              <Link className="auth-button" to="/authentication">
                Create Account
              </Link>
            ) : (
              ""
            )}
          </div>
        );
      }
    } else {
      boards = Object.keys(this.props.boardsToDisplay).map(
        function(key) {
          return (
            <Link
              key={key}
              style={{ textDecoration: "none", color: "#404040" }}
              to={`/board-detail/?board=${key}`}
            >
              <Board
                key={`boards-${Number(key)}`}
                board={this.props.boardsToDisplay[key]}
              />{" "}
            </Link>
          );
        }.bind(this)
      );
    }

    let boardsByCity;
    if (this.props.boardsByCity) {
      boardsByCity = Object.keys(this.props.boardsByCity).map(
        function(key) {
          const size = _.size(this.props.boardsByCity[key].boards);

          if (size == 0) {
            return;
          }

          return (
            <Marker
              key={`marker-${key}`}
              longitude={this.props.boardsByCity[key].longitude}
              latitude={this.props.boardsByCity[key].latitude}
            >
              <CityPin
                size={20}
                boardCount={_.size(this.props.boardsByCity[key].boards)}
                onClick={() => this.handleCityChange(key)}
              />
            </Marker>
          );
        }.bind(this)
      );
    }

    return (
      <div id="container" style={{ display: "flex" }}>

        <div id="boards" className="boards-page-container">
          <div className="board-page-mobile-header">
            <div className="mobile-headline t-sans">
              <div className="mobile-headline__a">
                <b>THE BEST PLACE TO BUY AND SELL</b>
              </div>
              <div className="mobile-headline__b">
                <b>USED SURFBOARDS</b>
              </div>
              <div className="mobile-headline__explore">
                <i className="fa fa-map-marker" /> Find a Board in Your Area
              </div>
              <div
                onClick={() => {
                  this.setState({
                    mobileLocationMenu: !this.state.mobileLocationMenu
                  });
                }}
                className="mobile-headline__dropdown"
              >
                <div className="mobile-headline__dropdown--text">
                  {this.state.mobileLocationTitle}
                </div>
                <i className="fa fa-chevron-down" />
              </div>
              {this.state.mobileLocationMenu ? (
                <div className="mobile-menu-dropdown">
                  <div
                    onClick={() => {
                      this.props.setRegionData("All Locations");
                      this.setState({
                        mobileLocationTitle: "All Locations",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    All Locations
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("Southern California");
                      this.setState({
                        mobileLocationTitle: "Southern California",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    Southern California
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("Northern California");
                      this.setState({
                        mobileLocationTitle: "Northern California",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    Northern California
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("Pacific North West");
                      this.setState({
                        mobileLocationTitle: "Pacific North West",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    Pacific North West
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("Mid Atlantic");
                      this.setState({
                        mobileLocationTitle: "Mid-Atlantic",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    Mid-Atlantic
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("South East");
                      this.setState({
                        mobileLocationTitle: "South East",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    South East
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("East Florida");
                      this.setState({
                        mobileLocationTitle: "East Florida",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    East Florida
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("Hawaii");
                      this.setState({
                        mobileLocationTitle: "Hawaii",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    Hawaii
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("Australia");
                      this.setState({
                        mobileLocationTitle: "Australia",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    Australia
                  </div>

                  <div
                    onClick={() => {
                      this.props.setRegionData("South Africa");
                      this.setState({
                        mobileLocationTitle: "South Africa",
                        mobileLocationMenu: false
                      });
                    }}
                    className="boardpage-location--mobile t-sans"
                  >
                    South Africa
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="board-page-header">
            <div className="board-page-header__wrap">
              <div className="line-1">
                <div className="line-1__a t-sans">
                  <b>THE BEST</b>
                </div>
                <div className="line-1__b t-sans">
                  <b>PLACE TO BUY</b>
                </div>
              </div>
              <div className="line-2">
                <div className="line-2-col-1 t-sans">
                  <b>AND</b>
                </div>
                <div className="line-2-col-2 t-sans">
                  <div className="line-2-col-2-a t-sans">
                    <b>SELL USED</b>
                  </div>
                  <div className="line-2-col-2-b t-sans">
                    <b>SURFBOARDS</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="board-page-location">
              <div className="board-page-location__headline t-sans">
                <i className="fa fa-map-marker" /> Find a Board in Your Area
              </div>
              <div className="board-page-location__locations">
                <div>
                  <div
                    onClick={() => this.props.setRegionData("All Locations")}
                    className="boardpage-location__area t-sans"
                  >
                    All Locations
                  </div>
                  <div
                    onClick={() =>
                      this.props.setRegionData("Southern California")
                    }
                    className="boardpage-location__area t-sans"
                  >
                    Southern California
                  </div>
                  <div
                    onClick={() =>
                      this.props.setRegionData("Northern California")
                    }
                    className="boardpage-location__area t-sans"
                  >
                    Northern California
                  </div>
                  <div
                    onClick={() =>
                      this.props.setRegionData("Pacific North West")
                    }
                    className="boardpage-location__area t-sans"
                  >
                    Pacific North West
                  </div>
                  <div
                    onClick={() => this.props.setRegionData("Mid Atlantic")}
                    className="boardpage-location__area t-sans"
                  >
                    Mid-Atlantic
                  </div>
                </div>
                <div style={{ marginLeft: "30px" }}>
                  <div
                    onClick={() => this.props.setRegionData("Hawaii")}
                    className="boardpage-location__area t-sans"
                  >
                    Hawaii
                  </div>
                  <div
                    onClick={() => this.props.setRegionData("East Florida")}
                    className="boardpage-location__area t-sans"
                  >
                    East Florida
                  </div>
                  <div
                    onClick={() => this.props.setRegionData("Australia")}
                    className="boardpage-location__area t-sans"
                  >
                    Australia
                  </div>
                  <div
                    onClick={() => this.props.setRegionData("South Africa")}
                    className="boardpage-location__area t-sans"
                  >
                    South Africa
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="boards-pages-secondary-container">
            {_.reverse(boards)}
          </div>
        </div>
        <div
          id="map"
          className="board-map"
          style={{
            width: "40%",
            position: "fixed",
            top: "60px",
            bottom: 0,
            right: 0
          }}
        >
          <MapGL
            mapboxApiAccessToken={
              "pk.eyJ1Ijoid2ViZG9vZCIsImEiOiJjajlnZTk0OTMyeGVhMndwOWJ4bDlqMDd1In0.TzYbLbUFco-TSaqObrvWTA"
            }
            width={this.state.width}
            height={this.state.height}
            latitude={this.props.latitude}
            longitude={this.props.longitude}
            zoom={this.props.mapZoom}
            mapStyle="mapbox://styles/webdood/cj9gc6pvx8udn2ro4lyqrxuo6"
            onViewportChange={viewport => {
              const { width, height, latitude, longitude, zoom } = viewport;
              this.props.setMapPosition(latitude, longitude);
            }}
          >
            {boardsByCity}
          </MapGL>
        </div>
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
