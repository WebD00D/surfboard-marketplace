import React, { Component } from "react";
import Link from "gatsby-link";
import { Route, Redirect } from "react-router-dom";

import Moment from 'react-moment';
import 'moment-timezone';

import fire from "../fire";
import { connect } from "react-redux";
import _ from "lodash";

import BoardUtils from '../utils/boardUtils';

import "../layouts/css/login.css";
import "../layouts/css/listing.css";
import "../layouts/css/tables.css";
import "../layouts/css/fcss.css";
import "../layouts/css/button.css";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: {}
    };
  }

  componentDidMount() {

    fire.database().ref("/boardsByUser/" + this.props.userId ).once('value').then(function(snapshot){
      this.setState({
        boards: snapshot.val()
      });
    }.bind(this))

  }

  handlePost(key) {
    alert(key);
  }


  render() {
    if (!this.props.userId) {
      return <Redirect to="/please-sign-in" />;
    }

    const boards = this.state.boards;
    const boardItems = [];
    _.forEach(boards, function(value, key) {

      let listDate;
      let date = new Date(key);
      console.log(date);

      boardItems.push(
        <div key={key} onClick={() => this.handlePost(key)} className="table-row">
          <div className="t-sans f-11 t-upper fw-500 ls-2 w-40p">
            {value.name}
          </div>
          <div className="t-sans f-11 t-upper fw-500 ls-2 w-20p">
            ${value.price}
          </div>
          <div className="t-sans f-11 t-upper fw-500 ls-2 w-20p">
            <Moment format="MM/DD/YYYY HH:mm A" date={value.listDate} />
          </div>
          <div className="t-sans f-11 t-upper fw-500 ls-2 w-20p fc-green">
            <span className={BoardUtils.getStatusClass(value.status)}>{value.status}</span>
          </div>
        </div>
      );
    }.bind(this));


    return (
      <div className="mx-992">
        <div className="fx fx-s-b fx-a-c m-b-48">
          <div className="create-account__headline m-b-10">Surfboards</div>
          <div>
            <Link
              to="/list-a-board"
              className="button button--green button--small"
            >
              New Listing
            </Link>
          </div>
        </div>
        <div>
          <div className="table-header">
            <div className="t-sans f-11 t-upper fw-500 ls-2 w-40p">Title</div>
            <div className="t-sans f-11 t-upper fw-500 ls-2 w-20p">Price</div>
            <div className="t-sans f-11 t-upper fw-500 ls-2 w-20p">
              Date Created
            </div>
            <div className="t-sans f-11 t-upper fw-500 ls-2 w-20p">Status</div>
          </div>

          <div className="table-rows">{boardItems}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userId, shop_coast }) => {
  return { userId, shop_coast };
};

export default connect(mapStateToProps)(Inventory);
