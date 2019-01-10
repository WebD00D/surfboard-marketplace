import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Link from "gatsby-link";
import cx from "classnames";
import _ from "lodash";
import fire from "../fire";

import "../layouts/css/navbar.css";
import "../layouts/css/fcss.css";

class Navbar extends PureComponent {
  constructor(props) {
    super(props);

    this.handleLocationDropDown = this.handleLocationDropDown.bind(this);
    this.handleSubLocationDropDown = this.handleSubLocationDropDown.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);

    this.state = {
      locationSelectorOpen: false,
      subLocationSelectorOpen: false,
      mobileMenuOpen: false
    };
  }

  handleLocationDropDown() {
    this.setState({
      locationSelectorOpen: !this.state.locationSelectorOpen
    });
  }

  handleSubLocationDropDown() {
    this.setState({
      subLocationSelectorOpen: !this.state.subLocationSelectorOpen
    });
  }

  handleRegionChange(region) {
    // https://www.findlatitudeandlongitude.com/?loc=southern+california#.WfmzKBOPI6g
    this.props.setRegionData(region);
    this.setState({
      locationSelectorOpen: false,
      subLocationSelectorOpen: false
    });
  }

  handleCityChange(city) {
    this.props.setCityData(city);
    this.setState({
      locationSelectorOpen: false,
      subLocationSelectorOpen: false
    });
  }

  render() {
    const cities = this.props.currentCityList.map((city, key) => (
      <div
        key={key}
        onClick={() => this.handleCityChange(city.name)}
        className="navbar__location__dropdown__item"
      >
        {city.name}
      </div>
    ));

    const mobileCities = this.props.currentCityList.map((city, key) => (
      <div
        key={key}
        onClick={() => this.handleCityChange(city.name)}
        className="navbar__location__dropdown__item"
      >
        {city.name}
      </div>
    ));

    const shopUser = this.props.userId ? (
      <span className="navbar__logo-title td-none fc-green">
        Welcome, {this.props.shop_name} |{" "}
        <a
          href="#"
          onClick={this.props.signOutUser}
          className="navbar__logo-title td-none"
        >
          Logout
        </a>
      </span>
    ) : (
      ""
    );

    return (
      <div className="navbar__wrapper">
        <div className="navbar-mobile">
          <Link to="/">
            <img
              className="navbar__logo"
              src={require("../layouts/images/BGLogoNew.svg")}
            />
          </Link>

          <i
            onClick={() => {
              this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen });
            }}
            className="hover fa fa-bars"
          />
        </div>

        {this.state.mobileMenuOpen ? (
          <div className="mobile-menu" >
            <div className="mobile-menu__header">

              <img
                className="navbar__logo"
                src={require("../layouts/images/bg-logo-color.svg")}
              />


              <i
                onClick={() => {
                  this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen });
                }}
                className="hover fa fa-close"
              />
            </div>

            <Link
              to="/buy-boards"
              onClick={() => {
                this.setState({ mobileMenuOpen: false });
              }}
              className="mobile-menu__item hover"
            >
              Buy Boards
            </Link>
            <Link
            onClick={() => {
              this.setState({ mobileMenuOpen: false });
            }}
             className="mobile-menu__item hover" to="/sell-a-board">
              Sell Boards
            </Link>

            <Link
              to="/faqs"
              onClick={() => {
                this.setState({ mobileMenuOpen: false });
              }}
              className="mobile-menu__item hover"
            >
              FAQs
            </Link>



            <a
              className="mobile-menu__item hover"
              target="_blank"
              href="https://medium.com/boardgrab"
            >
              Blog
            </a>



            {this.props.userAuthenticated && !this.props.isSeller ? (
              <Link
              onClick={() => {
                this.setState({ mobileMenuOpen: false });
              }}
               className="mobile-menu__item" to="/sell-with-us">
                Start Selling
              </Link>
            ) : (
              ""
            )}
            {this.props.userAuthenticated ? (
              <Link
              onClick={() => {
                this.setState({ mobileMenuOpen: false });
              }}
               className="mobile-menu__item hover" to="/account">
                My Account{" "}
                {this.props.hasNotifications ? (
                  <i className="fa fa-bell fc-red" />
                ) : (
                  ""
                )}{" "}
              </Link>
            ) : (
              ""
            )}

            {this.props.userAuthenticated ? (
              <Link
                to="/authentication"
                onClick={ () => {
                this.props.signOutUser;
                this.setState({ mobileMenuOpen: false });

                } }
                className="mobile-menu__item hover"
              >
                Signout
              </Link>
            ) : (
              <Link
              onClick={() => {
                this.setState({ mobileMenuOpen: false });
              }}
              className="mobile-menu__item " to="/authentication">
                Login / Register
              </Link>
            )}


          </div>
        ) : (
          ""
        )}



        <div className="navbar">


        <Link to="/">
          <img
            className="navbar__logo"
            src={require("../layouts/images/BGLogoNew.svg")}
          />
        </Link>

        <div style={{ display: "flex" }}>


        <Link className="navbar__link hover" to="/buy-boards">
           Buy Boards
        </Link>

        <Link className="navbar__link hover" to="/sell-a-board">
          Sell Boards
        </Link>

        <Link className="navbar__link hover" to="/faqs">
          Faqs
        </Link>

        <a className="navbar__link hover" target="_blank" href="https://medium.com/boardgrab">
          Blog
        </a>


          {this.props.userAuthenticated && !this.props.isSeller ? (
            <Link className="navbar__link" to="/sell-with-us">
              Start Selling
            </Link>
          ) : (
            ""
          )}
          {this.props.userAuthenticated ? (
            <Link className="navbar__link hover" to="/account">
              My Account{" "}
              {this.props.hasNotifications ? (
                <i className="fa fa-bell fc-red" />
              ) : (
                ""
              )}{" "}
            </Link>
          ) : (
            ""
          )}

          {this.props.userAuthenticated ? (
            <Link
              to="/authentication"
              onClick={this.props.signOutUser}
              className="navbar__link hover"
            >
              Signout
            </Link>
          ) : (
            <Link className="navbar__link " to="/authentication">
              Login / Register
            </Link>
          )}
        </div>

        </div>





      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signOutUser: () => dispatch({ type: `LOGOUT_USER` }),
    setRegionData: region =>
      dispatch({ type: `SET_REGION_AND_CITIES`, region }),
    setCityData: city => dispatch({ type: `SET_CITY_DATA`, city })
  };
};

const mapStateToProps = ({
  count,
  userId,
  shop_name,
  regions,
  citesByRegion,
  selectedRegion,
  currentCityList,
  selectedCity,
  userAuthenticated,
  account_username,
  isSeller,
  hasNotifications
}) => {
  return {
    count,
    userId,
    shop_name,
    regions,
    citesByRegion,
    selectedRegion,
    currentCityList,
    selectedCity,
    userAuthenticated,
    account_username,
    isSeller,
    hasNotifications
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
