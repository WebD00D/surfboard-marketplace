import React, { PureComponent } from "react";
import Link from "gatsby-link";
import cx from "classnames";
import fire from "../fire";
import { connect } from "react-redux";
import _ from "lodash";
import Moment from "react-moment";
import "moment-timezone";

import "../layouts/css/login.css";
import "../layouts/css/listing.css";
import "../layouts/css/tables.css";
import "../layouts/css/fcss.css";
import "../layouts/css/button.css";

class Purchases extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      purchases: {}
    };
  }

  componentDidMount() {
    // GET ALL BOARDS USER HAS PURCHASED .
    var boardRef = fire.database().ref(`/users/${this.props.userId}/purchases`);

    boardRef.on(
      "value",
      function(snapshot) {
        console.log("BOARD PURCHASES", snapshot.val());
        this.setState({
          purchases: snapshot.val()
        });
      }.bind(this)
    );
  }

  render() {
    const purchasesMadeDataSource = this.state.purchases;
    const purchasesMadeList = [];

    _.forEach(
      purchasesMadeDataSource,
      function(v, k) {
        console.log("DETAILS ABOUT Purchases", v);

        var pricePaid = v.pricePaid / 100;

        purchasesMadeList.push(
          <div className="table-row" key={k} style={{ marginBottom: "28px", justifyContent: 'space-between' }}>
            <div className={cx(["t-sans f-11 ls-2 w-40p fc-green w-100p-m"])}>
            <Link className="fc-green" to={`/board-detail/?board=${v.boardId}`}><b>{v.board}</b></Link>
            <div><small>from {v.sellerUsername}</small></div>
            </div>

            <div className={cx(["t-sans f-11  fw-500 ls-2 w-20p w-100p-m t-right fx fx-col fc-green"])} style={{paddingRight:'8px'}}>

              Paid ${pricePaid}

            </div>
          </div>
        );
      }.bind(this)
    );

    var purchasesMadeListReversed = _.reverse(purchasesMadeList);

    return (
      <div>
        <div className="table-rows">
          {purchasesMadeList.length > 0 ? (
            <div>{purchasesMadeListReversed}</div>
          ) : (
            <div className="t-sans f-13 t-center">0 Purchases</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userId,
  userAuthenticated,
  account_username,
  firstTimeLogin,
  allBoardsList
}) => {
  return {
    userId,
    userAuthenticated,
    account_username,
    firstTimeLogin,
    allBoardsList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createAndSignInUser: (userId, account_username) =>
      dispatch({ type: `CREATE_AND_SIGNIN_USER`, userId, account_username }),
    setCurrentUser: userId => dispatch({ type: `SET_CURRENT_USER`, userId }),
    getAllBoards: boards => dispatch({ type: `GET_ALL_BOARDS`, boards })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Purchases);
