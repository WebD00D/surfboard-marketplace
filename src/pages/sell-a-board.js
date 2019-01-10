import React, { Component } from "react";
import Link from "gatsby-link";
import { Route, Redirect } from "react-router-dom";
import fire from "../fire";
//import boardfax from "../boardfax";
import FatherTime from "../utils/fatherTime";
import { connect } from "react-redux";
import Moment from "react-moment";
import Dropzone from "react-dropzone";
import LoadImage from "blueimp-load-image";

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
    this.updateCityFromRegionChange = this.updateCityFromRegionChange.bind(
      this
    );
    this.updateCityLongitudeLatitude = this.updateCityLongitudeLatitude.bind(
      this
    );

    this.uploadPhoto = this.uploadPhoto.bind(this);
    this._uploadPhoto = this._uploadPhoto.bind(this);

    this.state = {
      imageLoading: false,
      region: "Southern California",
      city: "San Diego",
      longitude: -117.14996337890625,
      latitude: 32.71566625570317,
      postError: false,
      postErrorMessage: "",

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
      justPostedId: "",

      tag_beginner: false,
      tag_intermediate: false,
      tag_advanced: false,
      tag_greatforanybody: false,
      tag_smallwaves: false,
      tag_budget: false,

      newShaper: false,
      newModel: true,

      photoOnePreview: '',
      photoOneFile: null,
      photoTwoPreview: '',
      photoTwoFile: null,
      photoThreePreview: '',
      photoThreeFile: null,
      photoFourPreview: '',
      photoFourFile: null,
      photoFivePreview: '',
      photoFiveFile: null
    };
  }

  componentDidMount() {
    // check if user is signed in ..

  //  const bgcookie = this.getCookie("boardgrab_user");

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

    // end check if user is signed in..
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

  _uploadPhoto(files) {

    console.log(files[0].preview)

    if ( this.state.photoOnePreview.trim() == "" ) {
      this.setState({
        photoOnePreview: files[0].preview,
        photoOneFile: files[0]
      })
      return;
    }

    if ( this.state.photoTwoPreview.trim() == "" ) {
      this.setState({
        photoTwoPreview: files[0].preview,
        photoTwoFile: files[0]
      })
      return;
    }

    if ( this.state.photoThreePreview.trim() == "" ) {
      console.log("photo three uploadig")
      this.setState({
        photoThreePreview: files[0].preview,
        photoThreeFile: files[0]
      })
      return;
    }

    if ( this.state.photoFourPreview.trim() == "" ) {
      this.setState({
        photoFourPreview: files[0].preview,
        photoFourFile: files[0]
      })
      return;
    }

    if ( this.state.photoFivePreview.trim() == "" ) {
      this.setState({
        photoFivePreview: files[0].preview,
        photoFiveFile: files[0]
      })
      return;
    }


    // const dateTime = Date.now();
    // const storageRef = fire.storage().ref().child(`BG-${dateTime}-${files[0].name}`);
    // storageRef.put(files[0]).then(function(snapshot) {
    //   this.setState({
    //     avatar: snapshot.metadata.downloadURLs[0]
    //   })
    // }.bind(this));

  }

  uploadPhoto(files) {
    console.log("LOAD IMAGE", LoadImage);

    let originalFile = files[0];

    this.setState({
      imageLoading: true
    });

    LoadImage(
      originalFile,
      function(img) {
        img.toBlob(
          function(blob) {
            console.log(blob);

            var url = URL.createObjectURL(blob);
            console.log("URL", url);
            this.setState({
                avatar: url
            })

            const dateTime = Date.now();
            const storageRef = fire
              .storage()
              .ref()
              .child(`BG-${dateTime}-${files[0].name}`);
            storageRef.put(blob).then(
              function(snapshot) {
                this.setState({
                  avatar: snapshot.metadata.downloadURLs[0],
                  imageLoading: false
                });
              }.bind(this)
            );
          }.bind(this)
        );
      }.bind(this),
      {
        orientation: true
      }
    );

    console.log("AVATAR", this.state.avatar)
  }

  updateCityFromRegionChange(region) {
    let city, longitude, latitude;

    switch (region) {
      case "Southern California":
        city = "San Diego";
        longitude = -117.14996337890625;
        latitude = 32.71566625570317;
        break;
      case "Northern California":
        city = "Monterey";
        longitude = -121.904296875;
        latitude = 37.341775502148586;
        break;
      case "Pacific North West":
        city = "Portland";
        longitude = -122.684326171875;
        latitude = 45.51404592560424;
        break;
      case "Mid Atlantic":
        city = "Richmond";
        longitude = -77.442626953125;
        latitude = 37.54457732085582;
        break;
      case "South East":
        city = "Emerald Isle";
        longitude = -76.9427490234375;
        latitude = 34.66484057821928;
        break;
      case "East Florida":
        city = "St. Augustine";
        longitude = -81.32080078125;
        latitude = 29.91685223307017;
        break;
      case "Hawaii":
        city = "O'ahu";
        longitude = -157.9998779296875;
        latitude = 21.442843107187656;
        break;
      case "Australia":
        city = "Melbourne";
        longitude = 145.01953125;
        latitude = -37.85750715625203;
        break;
      case "South Africa":
        city = "Cape Town";
        longitude = 18.4185791015625;
        latitude = -33.934245311173115;
        break;
      default:
    }

    this.setState({
      city,
      longitude,
      latitude
    });
  }

  updateCityLongitudeLatitude(c) {
    // set city , longitiude, and latitude....

    let city, longitude, latitude;

    switch (c) {
      // SOUTHERN CALIFORNIA ..
      case "San Diego":
        city = "San Diego";
        longitude = -117.14996337890625;
        latitude = 32.71566625570317;
        break;
      case "La Jolla":
        city = "La Jolla";
        longitude = -117.26669311523438;
        latitude = 32.83459674730076;
        break;
      case "Del Mar":
        city = "Del Mar";
        longitude = -117.257080078125;
        latitude = 32.960281958039836;
        break;
      case "San Clemente":
        city = "San Clemente";
        longitude = -117.61138916015625;
        latitude = 33.42914915719729;
        break;
      case "Encinitas":
        city = "San Clemente";
        longitude = -117.279052734375;
        latitude = 33.03399561940715;
        break;
      case "Ocean Side":
        city = "Ocean Side";
        longitude = -117.36968994140625;
        latitude = 33.19847683493303;
        break;
      case "Long Beach":
        city = "Long Beach";
        longitude = -118.19503784179688;
        latitude = 33.773439833797745;
        break;
      case "Venice":
        city = "Venice";
        longitude = -118.47003936767578;
        latitude = 33.985787115598434;
        break;
      case "Santa Monica":
        city = "Santa Monica";
        longitude = -118.49647521972656;
        latitude = 34.021079493306914;
        break;
      case "Malibu":
        city = "Malibu";
        longitude = -118.78486633300781;
        latitude = 34.02990029603907;
        break;
      case "Ventura":
        city = "Ventura";
        longitude = -119.23187255859375;
        latitude = 34.27083595165;
        break;
      case "Santa Barbara":
        city = "Santa Barbara";
        longitude = -119.70977783203125;
        latitude = 34.42730166315869;
        break;

      // NORTHERN CALIFORNIA
      case "Monterey":
        city = "Monterey";
        longitude = -121.88507080078125;
        latitude = 36.59127365634205;
        break;
      case "Santa Cruz":
        city = "Santa Cruz";
        longitude = -122.0196533203125;
        latitude = 36.97622678464096;
        break;
      case "San Jose":
        city = "San Jose";
        longitude = -121.904296875;
        latitude = 37.341775502148586;
        break;
      case "Palo Alto":
        city = "Palo Alto";
        longitude = -122.13775634765625;
        latitude = 37.45741810262938;
        break;
      case "San Francisco":
        city = "San Francisco";
        longitude = -122.4481201171875;
        latitude = 37.77071473849609;
        break;
      case "Berkely":
        city = "Berkely";
        longitude = -122.2833251953125;
        latitude = 37.87268533717655;
        break;
      case "Vallejo":
        city = "Vallejo";
        longitude = -122.25860595703125;
        latitude = 38.10646650598286;
        break;
      case "Mendacino":
        city = "Mendacino";
        longitude = -123.7774658203125;
        latitude = 39.30242456041487;
        break;

      // PACIFIC NORTH WEST

      case "Portland":
        city = "Portland";
        longitude = -122.684326171875;
        latitude = 45.51404592560424;
        break;
      case "Seattle":
        city = "Seattle";
        longitude = -122.36572265625;
        latitude = 47.60616304386874;
        break;
      case "Astoria":
        city = "Astoria";
        longitude = -123.8851244;
        latitude = 46.1916157;
        break;

      // MID ATLANTIC

      case "Richmond":
        city = "Richmond";
        longitude = -77.442626953125;
        latitude = 37.54457732085582;
        break;
      case "Virginia Beach":
        city = "Virginia Beach";
        longitude = -75.9814453125;
        latitude = 36.85325222344019;
        break;
      case "Outer Banks":
        city = "Outer Banks";
        longitude = -75.6243896484375;
        latitude = 35.94688293218141;
        break;
      case "Southern Delaware":
        city = "Southern Delaware";
        longitude = -75.07232666015625;
        latitude = 38.53527591154414;
        break;
      case "Ocean City":
        city = "Ocean City";
        longitude = -74.5806884765625;
        latitude = 39.281167913914636;
        break;
      case "Eastern Shore":
        city = "Eastern Shore";
        longitude = -75.7122802734375;
        latitude = 37.56417412088097;
        break;
      case "Atlantic City":
        city = "Atlantic City";
        longitude = -74.44610595703125;
        latitude = 39.37040245787161;
        break;
      case "Long Beach Island":
        city = "Long Beach Island";
        longitude = -74.190673828125;
        latitude = 39.65434146406167;
        break;
      case "Seaside Heights":
        city = "Seaside Heights";
        longitude = -74.07257080078125;
        latitude = 39.9434364619742;
        break;

      // SOUTH EAST
      case "Emerald Isle":
        city = "Emerald Isle";
        longitude = -76.9427490234375;
        latitude = 34.66484057821928;
        break;
      case "Wrightsville Beach":
        city = "Wrightsville Beach";
        longitude = -77.80517578125;
        latitude = 34.17090836352573;
        break;
      case "Surf City":
        city = "Surf City";
        longitude = -77.5469970703125;
        latitude = 34.42956713470528;
        break;
      case "Myrtle Beach":
        city = "Myrtle Beach";
        longitude = -78.8873291015625;
        latitude = 33.69235234723729;
        break;
      case "Charleston":
        city = "Charleston";
        longitude = -79.9310302734375;
        latitude = 32.78265637602964;
        break;
      case "Folly Beach":
        city = "Folly Beach";
        longitude = -79.9420166015625;
        latitude = 32.654407116645416;
        break;
      case "Hilton Head":
        city = "Hilton Head";
        longitude = -80.738525390625;
        latitude = 32.20582936513577;
        break;
      case "Tybee Island":
        city = "Tybee Island";
        longitude = -80.84976196289062;
        latitude = 31.99643007718664;
        break;
      case "Brunswick":
        city = "Brunswick";
        longitude = -81.47872924804688;
        latitude = 31.15053220759678;
        break;

      // EAST FLORIDA
      case "St. Augustine":
        city = "St. Augustine";
        longitude = -81.32080078125;
        latitude = 29.91685223307017;
        break;
      case "Cocoa Beach":
        city = "Cocoa Beach";
        longitude = -80.60943603515625;
        latitude = 28.321306762152954;
        break;
      case "Palm Beach":
        city = "Palm Beach";
        longitude = -80.05050659179688;
        latitude = 26.698998877374333;
        break;
      case "Delray":
        city = "Delray";
        longitude = -80.07522583007812;
        latitude = 26.45950861170239;
        break;
      case "Miami":
        city = "Miami";
        longitude = -80.20294189453125;
        latitude = 25.764030136696327;
        break;

      // HAWAII
      case "O'ahu":
        city = "O'ahu";
        longitude = -157.9998779296875;
        latitude = 21.442843107187656;
        break;
      case "Maui":
        city = "Maui";
        longitude = -156.6705322265625;
        latitude = 20.87677672772702;
        break;
      case "Hawaii":
        city = "Hawaii";
        longitude = -155.85617065429688;
        latitude = 20.035289711352377;
        break;

      // SOUTH AFRICA
      case "Cape Town":
        city = "Cape Town";
        longitude = 18.4185791015625;
        latitude = -33.934245311173115;
        break;

      // AUSTRALIA
      case "Melbourne":
        city = "Melbourne";
        longitude = 145.01953125;
        latitude = -37.85750715625203;
        break;
      case "Sydney":
        city = "Sydney";
        longitude = 151.083984375;
        latitude = -33.87041555094182;
        break;

      default:
    }

    this.setState({
      city,
      longitude,
      latitude
    });
  }

  handlePostAnother() {
    this.setState({
      boardJustPosted: false
    });
  }

  handleListing() {
    const dateTime = Date.now();

    this.setState({
      postError: false,
      postErrorMessage: "",
    })


    if ( !this.state.listingTitle ) {
        this.setState({
          postError: true,
          postErrorMessage: "Please set a listing title!"
        })
        return;
    }

    if ( !this.state.avatar ) {
        this.setState({
          postError: true,
          postErrorMessage: "Please include an image!"
        })
        return;
    }

    if ( !this.state.price ) {
      this.setState({
        postError: true,
        postErrorMessage: "Please include a price!"
      })
      return;
    }


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

    // DO AN UPDATE FOR THE CITY LONGITUDE AND LATITUDE...
    let cityMeta = {};
    cityMeta[`boardsByCity/${this.state.city}/latitude`] = this.state.latitude;
    cityMeta[
      `boardsByCity/${this.state.city}/longitude`
    ] = this.state.longitude;

    fire
      .database()
      .ref()
      .update(cityMeta);

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
      boardJustPosted: true,
      justPostedId: dateTime
    });
  }

  render() {
    if (!this.props.userAuthenticated) {
      return (
        <div>
          <div className="page-header">
            <b className="t-sans">Sell a Board</b>
          </div>
          <div className="create-account t-center">
            <div
              className="m-b-10 bold t-sans t-center"
              style={{ marginBottom: "22px" }}
            >
              <b>
                We're stoked you want to sell a board, but first you gotta sign
                in or create an account!
              </b>
            </div>
            <Link
              to="/authentication"
              className="button button--green "
              style={{ display: "inline-block" }}
            >
              {" "}
              Sign In
            </Link>
          </div>
        </div>
      );
    }

    const cities = this.props.dropDownCityList.map((city, key) => {
      if (city.name != "All Cities") {
        return (
          <option key={key} value={city.name}>
            {city.name}
          </option>
        );
      }
    });

    // if (!this.props.userId) {
    //   return <Redirect to="/authentication" />;
    // }

    if (this.state.boardJustPosted) {
      return (
        <div>
          <div className="page-header">
            <b className="t-sans">Sell a Board</b>
          </div>
          <div className="create-account t-center">
            <div className="t-sans t-center">
              <b>
                Success! Your board has been listed. Check it out{" "}
                <Link
                  to={`/board-detail/?board=${this.state.justPostedId}`}
                  className="fc-green td-none"
                >
                  here
                </Link>, or maybe{" "}
                <span
                  onClick={this.handlePostAnother}
                  className="fc-green hover"
                >
                  post another?
                </span>
              </b>
            </div>
            <img
              style={{
                maxHeight: "300px",
                borderRadius: "6px",
                marginTop: "22px"
              }}
              src={this.state.avatar}
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="page-header">
          <b className="t-sans">Sell a Board</b>
        </div>
        <div className="create-account">
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
              />
            </div>
            <label>Brand / Shaper </label>
            <input
              name="brandShaper"
              onChange={e => {
                this.setState({ brandShaper: e.target.value });
              }}
              type="text"
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
              />
            </div>
            <label>Dimensions </label>
            <input
              name="dimensions"
              onChange={e => {
                this.setState({ dimensions: e.target.value });
              }}
              type="text"
            />
            <label>Volume </label>
            <input
              name="volume"
              onChange={e => {
                this.setState({ volume: e.target.value });
              }}
              type="text"
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
              />
            </div>
            <label>Condition </label>
            <input
              name="condition"
              onChange={e => {
                this.setState({ condition: e.target.value });
              }}
              type="text"
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
              />
            </div>
            <label>Shaper Info </label>
            <input
              name="shaperInfo"
              onChange={e => {
                this.setState({ shaperInfo: e.target.value });
              }}
              type="text"
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
                    name="beginners"
                    onChange={e => {
                      let checked = document.getElementById("tag_beginner")
                        .checked;
                      this.setState({ tag_beginner: checked });
                    }}
                    type="checkbox"
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
                    name="beginners"
                    onChange={e => {
                      let checked = document.getElementById("tag_intermediate")
                        .checked;
                      this.setState({ tag_intermediate: checked });
                    }}
                    type="checkbox"
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
                    name="beginners"
                    onChange={e => {
                      let checked = document.getElementById("tag_advanced")
                        .checked;
                      this.setState({ tag_advanced: checked });
                    }}
                    type="checkbox"
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
                    name="beginners"
                    onChange={e => {
                      let checked = document.getElementById(
                        "tag_greatforanybody"
                      ).checked;
                      this.setState({ tag_greatforanybody: checked });
                    }}
                    type="checkbox"
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
                    name="beginners"
                    onChange={e => {
                      let checked = document.getElementById("tag_smallwaves")
                        .checked;
                      this.setState({ tag_smallwaves: checked });
                    }}
                    type="checkbox"
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
                    name="beginners"
                    onChange={e => {
                      let checked = document.getElementById("tag_budget")
                        .checked;
                      this.setState({ tag_budget: checked });
                    }}
                    type="checkbox"
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
                  this.updateCityFromRegionChange(e.target.value);
                }}
              >
                <option value="Southern California">Southern California</option>
                <option value="Northern California">Northern California</option>
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
                onChange={e => {
                  this.setState({ city: e.target.value });
                  this.updateCityLongitudeLatitude(e.target.value);
                }}
                value={this.state.city}
              >
                {cities}
              </select>
            </div>
          </div>

          <div className="login-form__field m-t-30 m-b-0">
            <div className="login-form__field" style={{ alignItems: "center" }}>
              {this.state.imageLoading ? (
                <div>
                <div className="t-sans t-center">Uploading and optimizing image <br /> <small>( This can take several seconds )</small></div>
                <div className="loader">Loading...</div>
                </div>
              ) : (
                ""
              )}

              {this.state.avatar ? (
                <img style={{ marginBottom: "22px" }} src={this.state.avatar} />
              ) : (
                ""
              )}
              <Dropzone onDrop={this.uploadPhoto} multiple={false}>
                <p
                  style={{
                    textAlign: "center",
                    paddingTop: "20px",
                    fontFamily: "Montserrat",
                    marginTop: "22px"
                  }}
                >
                  Click or drop your board photo.
                </p>
              </Dropzone>
            </div>
          </div>

          <div className="login-form__field m-t-30 m-b-0 d-none">
            <div className="stab-travel__photo--row">
              <div className="stab-travel__photo-wrap">
                <span className="stab-travel__photo-count">1</span>
                {this.state.photoOnePreview ? (
                  <div
                    className="stab-travel__photo-lg stab-travel___photo-bg"
                    style={{
                      backgroundImage: `url(${this.state.photoOnePreview})`
                    }}
                  />
                ) : (
                  <Dropzone
                    onDrop={this._uploadPhoto}
                    className="stab-travel__photo-lg"
                    multiple={false}
                  />
                )}
              </div>
              <div className="stab-travel__small-photo-row">
                <div className="stab-travel-small-photo-half">
                  <div className="stab-travel__photo-wrap">
                    <span className="stab-travel__photo-count">2</span>
                    {this.state.photoTwoPreview ? (
                      <div
                        className="stab-travel__photo-sm stab-travel___photo-bg"
                        style={{
                          backgroundImage: `url(${this.state.photoTwoPreview})`
                        }}
                      />
                    ) : (
                      <Dropzone
                        onDrop={this._uploadPhoto}
                        className="stab-travel__photo-sm"
                        multiple={false}
                      />
                    )}
                  </div>
                  <div className="stab-travel__photo-wrap">
                    <span className="stab-travel__photo-count">3</span>
                    {this.state.photoThreePreview ? (
                      <div
                        className="stab-travel__photo-sm stab-travel___photo-bg"
                        style={{
                          backgroundImage: `url(${
                            this.state.photoThreePreview
                          })`
                        }}
                      />
                    ) : (
                      <Dropzone
                        onDrop={this._uploadPhoto}
                        className="stab-travel__photo-sm"
                        multiple={false}
                      />
                    )}
                  </div>
                </div>
                <div className="stab-travel-small-photo-half">
                  <div className="stab-travel__photo-wrap">
                    <span className="stab-travel__photo-count">4</span>
                    {this.state.photoFourPreview ? (
                      <div
                        className="stab-travel__photo-sm stab-travel___photo-bg"
                        style={{
                          backgroundImage: `url(${this.state.photoFourPreview})`
                        }}
                      />
                    ) : (
                      <Dropzone
                        onDrop={this._uploadPhoto}
                        className="stab-travel__photo-sm"
                        multiple={false}
                      />
                    )}
                  </div>
                  <div className="stab-travel__photo-wrap">
                    <span className="stab-travel__photo-count">5</span>
                    {this.state.photoFivePreview ? (
                      <div
                        className="stab-travel__photo-sm stab-travel___photo-bg"
                        style={{
                          backgroundImage: `url(${this.state.photoFivePreview})`
                        }}
                      />
                    ) : (
                      <Dropzone
                        onDrop={this._uploadPhoto}
                        className="stab-travel__photo-sm"
                        multiple={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={this.handleListing}
            className="button button--green button--large"
          >
            Publish Listing
          </button>
          <br />
          { this.state.postError ? <div className="t-sans t-center" style={{color: 'red'}}><b>{this.state.postErrorMessage}</b></div> : "" }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userId,
  shop_coast,
  dropDownCityList,
  userAuthenticated
}) => {
  return { userId, shop_coast, dropDownCityList, userAuthenticated };
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
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListABoard);
