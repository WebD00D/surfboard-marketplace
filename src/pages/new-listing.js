
  import React, { PureComponent } from "react";
import Link from "gatsby-link";
import fire from "../fire";

import "../layouts/css/login.css";
import "../layouts/css/listing.css";

class NewListing extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      brand: "",
      model: "",
      dims: "",
      fins: "",
      condition: "",
      description: "",
      shaperinfo: "",
    };
  }

  render() {
    return (
      <div className="new-listing">
        <div className="new-listing__headline">List a Board</div>
        <div className="login-form__field">
          <label>Listing Title </label>
          <input
            name="title"
            onChange={e => {
              this.setState({ title: e.target.value });
            }}
            type="text"
            placeholder={`5'8" Rusty Dwart`}
          />
        </div>
        <div className="login-form__field">
          <label>Brand / Shaper</label>
          <input
            name="brand"
            onChange={e => {
              this.setState({ brand: e.target.value });
            }}
            type="text"
            placeholder={`Type to search or add new`}
          />
        </div>
        <div className="login-form__field">
          <label>Model</label>
          <input
            name="brand"
            onChange={e => {
              this.setState({ model: e.target.value });
            }}
            type="text"
            placeholder={`Type to search or add new`}
          />
        </div>
        <div className="login-form__field">
          <label>Dimensions</label>
          <input
            name="brand"
            onChange={e => {
              this.setState({ dims: e.target.value });
            }}
            type="text"
            placeholder={`5'8" x 22" x 3" `}
          />
        </div>
        <div className="login-form__field">
          <label>Fins</label>
          <select
            onChange={e => {
              this.setState({
                fins: e.target.value
              });
            }}
          >
            <option value="NONE" />
            <option data-coast="west" value="CA">1-Fin</option>
            <option data-coast="east" value="CT">2-Fin</option>
            <option data-coast="east" value="DE">3-Fin</option>
            <option data-coast="east" value="DE">4-Fin</option>
            <option data-coast="east" value="DE">5-Fin</option>
          </select>
        </div>
        <div className="login-form__field">
          <label>Condition</label>
          <textarea
            onChange={e => {
              this.setState({
                condition: e.target.value
              });
            }}
          />
        </div>
        <div className="login-form__field">
          <label>Description</label>
          <textarea
            onChange={e => {
              this.setState({
                description: e.target.value
              });
            }}
          />
        </div>
        <div className="login-form__field">
          <label>Shaper Info</label>
          <textarea
            onChange={e => {
              this.setState({
                shaperinfo: e.target.value
              });
            }}
          />
        </div>
        <div className="login-form__field">
          <label>Price</label>
          <input
            name="price"
            onChange={e => {
              this.setState({ price: e.target.value });
            }}
            type="number"
          />
        </div>
        <button

          className="button button--green button--large"
        >
          Publish Listing
        </button>
      </div>
    );
  }
}

export default NewListing;
