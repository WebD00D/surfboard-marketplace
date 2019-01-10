import React, {PureComponent} from 'react';
import Link from 'gatsby-link'
import cx from "classnames";
import fire from "../fire";
import { connect } from "react-redux";
import _ from "lodash";
import Moment from 'react-moment';
import 'moment-timezone';

import "../layouts/css/login.css";
import "../layouts/css/listing.css";
import "../layouts/css/tables.css";
import "../layouts/css/fcss.css";
import "../layouts/css/button.css";

class OffersReceived extends PureComponent {

  constructor(props) {
      super(props);

      this.handleOfferAccept = this.handleOfferAccept.bind(this);

      this.state = {
        sendMessageBackToEmail: '',
        offersReceived: {}
      }

  }

  componentDidMount() {
    // GET ALL THE SELLERS OFFERS PER BOARD...
    var messageRef = fire.database().ref('/users/' + this.props.userId + '/offersReceived');

    messageRef.on('value', function(snapshot){

      this.setState({
        offersReceived: snapshot.val()
      })
    }.bind(this))
  }


  handleOfferAccept(offerId, buyerId, boardId, boardName) {

    let buyerEmail;

    fire
      .database()
      .ref("users/" + buyerId)
      .once("value")
      .then(
        function(snapshot) {
          console.log("OTHER USER SNAPSHOT", snapshot.val());

          buyerEmail = snapshot.val().email;

          const shortMessage = `${this.props.account_username} has accepted your offer for ${boardName}! Visit your account to view and purchase!`

          fetch(
            `https://boardgrab-api.herokuapp.com/send-accepted-offer-notification?email=${buyerEmail}&username=${this.props.account_username}&bodySnippet=${shortMessage}`
          ).then(function(response) {
            console.log("RESPONSE", response);
          });


        }.bind(this)
      );


    var updates = {};
    updates[`offers/${boardId}/offersMade/${offerId}/offerAccepted`] = true;
    updates[`users/${this.props.userId}/offersReceived/${boardId}/offers/${offerId}/offerAccepted`] = true;
    updates[`users/${buyerId}/offersMade/${boardId}/offerAccepted`] = true;

    fire
    .database()
    .ref()
    .update(updates);
  }


  render() {

    const offersReceivedDataSource = this.state.offersReceived;

    let offersReceivedList = [];
    let offersReceivedItems = [];

    _.forEach(offersReceivedDataSource, function(value, key) {

            console.log('OFFERS RECEIVED LIST',  value);


            _.forEach(value.offers, function(v, k) {

                console.log('DETAILS ABOUT THE SPECIFIC OFFEr', v)

                offersReceivedItems.push(

                        <div className="offers__row" key={k}>
                            <div>
                                <div className="f-16 fw-500">${v.amountOffered}</div>
                                <div><Moment format="MM/DD/YYYY @ hh:mm A" date={v.offerDate} /> from {v.buyerUsername}</div>
                            </div>
                            <div>
                                {
                                    v.offerAccepted
                                        ? <div className="fc-green t-sans fw-500" style={{fontStyle: 'italic', paddingRight: '30px'}}>Offer Accepted</div>
                                        : <button onClick={ () => this.handleOfferAccept( k, v.buyerId, v.boardId, v.boardName ) } className="message-box__button">Accept Offer</button>
                                }
                            </div>
                        </div>

                )

            }.bind(this))

            let offersReceivedItemsReverse = _.reverse(offersReceivedItems)

            offersReceivedList.push (
                <div key={key} style={{marginBottom: '28px'}}>
                    <div className="offers__header">{value.name}</div>
                    <div>
                        {offersReceivedItemsReverse}
                    </div>
                </div>
            )

            offersReceivedItems = [];


        }.bind(this));

        const offersReceivedListReverse = _.reverse(offersReceivedList)



	return (<div>
			<div className="table-rows">

				{offersReceivedList.length > 0 ? (
					<div>{offersReceivedListReverse}</div>
				) : (
					<div className="t-sans f-13 t-center">0 Offers Received</div>
				)}
			</div>
            </div>);
  }
}

const mapStateToProps = ({ userId, userAuthenticated, account_username, firstTimeLogin, allBoardsList }) => {
  return { userId, userAuthenticated, account_username, firstTimeLogin, allBoardsList };
};

const mapDispatchToProps = dispatch => {
  return {
    createAndSignInUser: (userId, account_username) => dispatch({ type: `CREATE_AND_SIGNIN_USER`, userId, account_username }),
    setCurrentUser: (userId) => dispatch({ type: `SET_CURRENT_USER`, userId }),
    getAllBoards: (boards) => dispatch({type: `GET_ALL_BOARDS`,boards}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OffersReceived);
