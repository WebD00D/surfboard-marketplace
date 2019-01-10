import React, { Component } from "react";
import Link from "gatsby-link";
import { Route, Redirect } from "react-router-dom";
import fire from "../fire";
//import boardfax from "../boardfax";
import FatherTime from "../utils/fatherTime";
import { connect } from "react-redux";
import Moment from "react-moment";

import "../layouts/css/login.css";
import "../layouts/css/listing.css";
import "../layouts/css/tables.css";
import "../layouts/css/fcss.css";
import "../layouts/css/button.css";

class ListABoard extends Component {
  constructor(props) {
    super(props);

    this.handleListing = this.handleListing.bind(this);

    this.handlePostAnother = this.handlePostAnother.bind(this);

    this.state = {
      userCanEdit: true,
      boardId: "",

      region: "",
      city: "",
      listingTitle: "",
      brandShaper: "",
      model: "",
      dimensions: "",
      fins: "",
      condition: "",
      height: "",
      volume: "",
      description: "",

      shaperInfo: "",
      price: "",

      avatar: "",
      photoOne: "",
      photoTwo: "",
      photoThree: "",
      photoFour: "",
      photoFive: "",
      photoSix: "",
      imageName: "",
      isUploading: false,
      photoOneProgress: 0,
      photoOneURL: "",
      boardJustPosted: false,

      tag_beginner: false,
      tag_intermediate: false,
      tag_advanced: false,
      tag_greatforanybody: false,
      tag_smallwaves: false,
      tag_budget: false,

      newShaper: false,
      newModel: true
    };
  }

  componentDidMount() {
    const boardId = this.getQueryVariable("boardId");

    fire
      .database()
      .ref(`/allBoardsList/boards/${boardId}`)
      .once("value")
      .then(
        function(snapshot) {
          console.log("EDIT SNAPSHOT", snapshot.val());

          if (this.props.userId != snapshot.val().userId) {
            this.setState({
              userCanEdit: false
            });
          } else {
            const board = snapshot.val();

            this.setState({
              boardId: boardId,
              region: board.region,
              city: board.city,
              listingTitle: board.name,
              brandShaper: board.brand,
              model: board.model,
              dimensions: board.dimensions,
              fins: board.fins,
              condition: board.condition,
              description: board.description,
              volume: board.volume,

              shaperInfo: board.shaperInfo,
              price: board.price,

              avatar: board.featurePhotoURL,
              photoOne: board.photoOne,
              photoTwo: board.photoTwo,
              photoThree: board.photoThree,
              photoFour: board.photoFour,
              photoFive: board.photoFive,
              photoSix: board.photoSix,
              imageName: "",
              isUploading: false,
              photoOneProgress: 0,
              photoOneURL: "",
              boardJustPosted: false,

              tag_beginner: board.tag_beginner,
              tag_intermediate: board.tag_intermediate,
              tag_advanced: board.tag_advanced,
              tag_greatforanybody: board.tag_greatforanybody,
              tag_smallwaves: board.tag_smallwaves,
              tag_budget: board.tag_budget,

              newShaper: false,
              newModel: true
            });

            this.props.setListingCities(board.region);
          }
        }.bind(this)
      );
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

  handlePostAnother() {
    this.setState({
      boardJustPosted: false
    });
  }



  handleListing() {
    const dateTime = this.state.boardId;

    // 1)  SAVE BOARD BY REGION
    fire
      .database()
      .ref(`boardsByRegion/${this.state.region}/${dateTime}`)
      .set({
        listDate: Date.now(),
        userId: this.props.userId,
        status: "PUBLISHED",
        region: this.state.region,
        city: this.state.city,
        name: this.state.listingTitle,
        brand: this.state.brandShaper,
        model: this.state.model,
        dimensions: this.state.dimensions,
        fins: this.state.fins,
        condition: this.state.condition,
        dimensions: this.state.dimensions,
        shaperInfo: this.state.shaperInfo,
        price: this.state.price,
        tag_beginner: this.state.tag_beginner,
        tag_intermediate: this.state.tag_intermediate,
        tag_advanced: this.state.tag_advanced,
        tag_greatforanybody: this.state.tag_greatforanybody,
        tag_smallwaves: this.state.tag_smallwaves,
        tag_budget: this.state.tag_budget,
        featurePhotoURL: this.state.avatar,
        photoOne: this.state.photoOne,
        photoTwo: this.state.photoTwo,
        photoThree: this.state.photoThree,
        photoFour: this.state.photoFour,
        photoFive: this.state.photoFive,
        photoSix: this.state.photoSix,
        volume: this.state.volume,
        sold: false,
        description: this.state.description
      });

    // 2) SAVE BOARD BY CITY
    fire
      .database()
      .ref(`boardsByCity/${this.state.city}/boards/${dateTime}`)
      .set({
        listDate: Date.now(),
        userId: this.props.userId,
        status: "PUBLISHED",
        region: this.state.region,
        city: this.state.city,
        name: this.state.listingTitle,
        brand: this.state.brandShaper,
        model: this.state.model,
        dimensions: this.state.dimensions,
        fins: this.state.fins,
        condition: this.state.condition,
        dimensions: this.state.dimensions,
        shaperInfo: this.state.shaperInfo,
        price: this.state.price,
        tag_beginner: this.state.tag_beginner,
        tag_intermediate: this.state.tag_intermediate,
        tag_advanced: this.state.tag_advanced,
        tag_greatforanybody: this.state.tag_greatforanybody,
        tag_smallwaves: this.state.tag_smallwaves,
        tag_budget: this.state.tag_budget,
        featurePhotoURL: this.state.avatar,
        photoOne: this.state.photoOne,
        photoTwo: this.state.photoTwo,
        photoThree: this.state.photoThree,
        photoFour: this.state.photoFour,
        photoFive: this.state.photoFive,
        photoSix: this.state.photoSix,
        volume: this.state.volume,
        sold: false,
        amountSoldFor: 0,
        description: this.state.description
      });

    // 3) SAVE TO ALL BOARD LIST
    fire
      .database()
      .ref(`allBoardsList/boards/${dateTime}`)
      .set({
        listDate: Date.now(),
        userId: this.props.userId,
        status: "PUBLISHED",
        region: this.state.region,
        city: this.state.city,
        name: this.state.listingTitle,
        brand: this.state.brandShaper,
        model: this.state.model,
        dimensions: this.state.dimensions,
        fins: this.state.fins,
        condition: this.state.condition,
        dimensions: this.state.dimensions,
        shaperInfo: this.state.shaperInfo,
        price: this.state.price,
        tag_beginner: this.state.tag_beginner,
        tag_intermediate: this.state.tag_intermediate,
        tag_advanced: this.state.tag_advanced,
        tag_greatforanybody: this.state.tag_greatforanybody,
        tag_smallwaves: this.state.tag_smallwaves,
        tag_budget: this.state.tag_budget,
        featurePhotoURL: this.state.avatar,
        photoOne: this.state.photoOne,
        photoTwo: this.state.photoTwo,
        photoThree: this.state.photoThree,
        photoFour: this.state.photoFour,
        photoFive: this.state.photoFive,
        photoSix: this.state.photoSix,
        volume: this.state.volume,
        sold: false,
        amountSoldFor: 0,
        description: this.state.description
      });

    // 4) SAVE BOARDS BY USER
    fire
      .database()
      .ref(`boardsByUser/${this.props.userId}/${dateTime}`)
      .set({
        listDate: Date.now(),
        userId: this.props.userId,
        status: "PUBLISHED",
        region: this.state.region,
        city: this.state.city,
        name: this.state.listingTitle,
        brand: this.state.brandShaper,
        model: this.state.model,
        dimensions: this.state.dimensions,
        fins: this.state.fins,
        condition: this.state.condition,
        dimensions: this.state.dimensions,
        shaperInfo: this.state.shaperInfo,
        price: this.state.price,
        tag_beginner: this.state.tag_beginner,
        tag_intermediate: this.state.tag_intermediate,
        tag_advanced: this.state.tag_advanced,
        tag_greatforanybody: this.state.tag_greatforanybody,
        tag_smallwaves: this.state.tag_smallwaves,
        tag_budget: this.state.tag_budget,
        featurePhotoURL: this.state.avatar,
        photoOne: this.state.photoOne,
        photoTwo: this.state.photoTwo,
        photoThree: this.state.photoThree,
        photoFour: this.state.photoFour,
        photoFive: this.state.photoFive,
        photoSix: this.state.photoSix,
        volume: this.state.volume,
        sold: false,
        amountSoldFor: 0,
        description: this.state.description
      });

    this.setState({
      boardJustPosted: true
    });
  }

  render() {
    const cities = this.props.dropDownCityList.map((city, key) => {
      if (city.name != "All Cities") {
        return (
          <option key={key} value={city.name}>
            {city.name}
          </option>
        );
      }
    });

    if (!this.props.userId) {
      return <Redirect to="/authentication" />;
    }

    if (this.state.boardJustPosted) {
      return (
        <div className="create-account">
          <div className="create-account__headline m-b-20">Board Edited.</div>
          <Link
            to={`/board-detail/?board=${this.state.boardId}`}
            className="td-none t-sans fc-green f-11 m-t-30"
          >
            View Listing
          </Link>
        </div>
      );
    }

    return (
      <div>
      <div className="page-header">
          <b className="t-sans">Edit Listing</b>
      </div>
      <div className="create-account">
        {!this.state.userCanEdit ? (
          <div>Permission Denied</div>
        ) : (
          <div>
            
            <Link to="/account" className="td-none t-sans fc-green f-11 ">
              Cancel and return to account page
            </Link>

            <div className="login-form__field m-t-30">
              <div className="login-form__field">
                <label>Listing Title </label>
                <input
                  name="listingTitle"
                  onChange={e => {
                    this.setState({ listingTitle: e.target.value });
                  }}
                  type="text"
                  value={this.state.listingTitle}
                />
              </div>
              <label>Brand / Shaper </label>
              <input
                name="brandShaper"
                onChange={e => {
                  this.setState({ brandShaper: e.target.value });
                }}
                type="text"
                value={this.state.brandShaper}
              />
            </div>

            <div className="login-form__field m-t-30">
              <div className="login-form__field">
                <label>Model </label>
                <input
                  name="model"
                  onChange={e => {
                    this.setState({ model: e.target.value });
                  }}
                  type="text"
                  value={this.state.model}
                />
              </div>
              <label>Dimensions </label>
              <input
                name="dimensions"
                onChange={e => {
                  this.setState({ dimensions: e.target.value });
                }}
                type="text"
                value={this.state.dimensions}
              />
              <label>Volume </label>
              <input
                name="volume"
                onChange={e => {
                  this.setState({ volume: e.target.value });
                }}
                type="text"
                value={this.state.volume}
              />
            </div>

            <div className="login-form__field m-t-30">
              <div className="login-form__field">
                <label>Fins </label>
                <input
                  name="fins"
                  onChange={e => {
                    this.setState({ fins: e.target.value });
                  }}
                  type="text"
                  value={this.state.fins}
                />
              </div>
              <label>Condition </label>
              <input
                name="condition"
                onChange={e => {
                  this.setState({ condition: e.target.value });
                }}
                type="text"
                value={this.state.condition}
              />
            </div>

            <div className="login-form__field m-t-30">
              <div className="login-form__field">
                <label>Description </label>
                <input
                  name="description"
                  onChange={e => {
                    this.setState({ description: e.target.value });
                  }}
                  type="text"
                  value={this.state.description}
                />
              </div>
              <label>Shaper Info </label>
              <input
                name="shaperInfo"
                onChange={e => {
                  this.setState({ shaperInfo: e.target.value });
                }}
                type="text"
                value={this.state.shaperInfo}
              />
            </div>

            <div className="login-form__field m-t-30">
              <div className="login-form__field">
                <label>Price </label>
                <input
                  name="price"
                  onChange={e => {
                    this.setState({ price: e.target.value });
                  }}
                  type="number"
                  value={this.state.price}
                />
              </div>
            </div>

            <div className="login-form__field m-t-30">
              <div className="login-form__field">
                <label>Tags </label>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="tag_beginner"
                      style={{
                        width: "30px",
                        marginBottom: "0px",
                        height: "20px"
                      }}
                      onChange={e => {
                        let checked = document.getElementById("tag_beginner")
                          .checked;
                        this.setState({ tag_beginner: checked });
                      }}
                      type="checkbox"
                      checked={this.state.tag_beginner}
                    />
                    <div className="tag">Beginner</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="tag_intermediate"
                      style={{
                        width: "30px",
                        marginBottom: "0px",
                        height: "20px"
                      }}
                      onChange={e => {
                        let checked = document.getElementById(
                          "tag_intermediate"
                        ).checked;
                        this.setState({ tag_intermediate: checked });
                      }}
                      type="checkbox"
                      checked={this.state.tag_intermediate}
                    />
                    <div className="tag">Intermediate</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="tag_advanced"
                      style={{
                        width: "30px",
                        marginBottom: "0px",
                        height: "20px"
                      }}
                      onChange={e => {
                        let checked = document.getElementById("tag_advanced")
                          .checked;
                        this.setState({ tag_advanced: checked });
                      }}
                      type="checkbox"
                      checked={this.state.tag_advanced}
                    />
                    <div className="tag">Advanced</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="tag_greatforanybody"
                      style={{
                        width: "30px",
                        marginBottom: "0px",
                        height: "20px"
                      }}
                      onChange={e => {
                        let checked = document.getElementById(
                          "tag_greatforanybody"
                        ).checked;
                        this.setState({ tag_greatforanybody: checked });
                      }}
                      type="checkbox"
                      checked={this.state.tag_greatforanybody}
                    />
                    <div className="tag">Great for anybody</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="tag_smallwaves"
                      style={{
                        width: "30px",
                        marginBottom: "0px",
                        height: "20px"
                      }}
                      onChange={e => {
                        let checked = document.getElementById("tag_smallwaves")
                          .checked;
                        this.setState({ tag_smallwaves: checked });
                      }}
                      type="checkbox"
                      checked={this.state.tag_smallwaves}
                    />
                    <div className="tag">Small Waves</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="tag_budget"
                      style={{
                        width: "30px",
                        marginBottom: "0px",
                        height: "20px"
                      }}
                      onChange={e => {
                        let checked = document.getElementById("tag_budget")
                          .checked;
                        this.setState({ tag_budget: checked });
                      }}
                      type="checkbox"
                      checked={this.state.tag_budget}
                    />
                    <div className="tag">On a Budget</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="login-form__field m-t-30">
              <div className="login-form__field">
                <label>Region</label>
                <select
                  onChange={e => {
                    this.setState({ region: e.target.value });
                    this.props.setListingCities(e.target.value);
                  }}
                  value={this.state.region}
                >
                  <option value="Southern California">
                    Southern California
                  </option>
                  <option value="Northern California">
                    Northern California
                  </option>
                  <option value="Pacific North West">Pacific North West</option>
                  <option value="Mid Atlantic">Mid Atlantic</option>
                  <option value="South East">South East</option>
                  <option value="East Florida">East Florida</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Australia">Australia</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>
            </div>

            <div className="login-form__field">
              <div className="login-form__field">
                <label>City</label>
                <select
                  value={this.state.city}
                  onChange={e => this.setState({ city: e.target.value })}
                >
                  {cities}
                </select>
              </div>
            </div>



            <button
              onClick={this.handleListing}
              className="button button--green button--large"
            >
              Update Listing
            </button>
          </div>
        )}
      </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userId, shop_coast, dropDownCityList }) => {
  return { userId, shop_coast, dropDownCityList };
};

const mapDispatchToProps = dispatch => {
  return {
    setListingCities: region => dispatch({ type: `SET_LISTING_CITIES`, region })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListABoard);
