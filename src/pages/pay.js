import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import fire from '../fire';
import '../layouts/css/site.css';
import '../layouts/css/board.css';
import '../layouts/css/fcss.css';
import '../layouts/css/tables.css';
import cx from 'classnames';
import Link from 'gatsby-link';
import Moment from 'react-moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import 'whatwg-fetch';

class Payment extends PureComponent {
  constructor(props) {
    super(props);

    this.handlePayment = this.handlePayment.bind(this);

    this.state = {
      buttonClicked: false,
      stripeUser: '',
      sellerEmail: '',
      sellerUsername: '',
      sellerId: '',
      buyerEmail: '',
      amount: 0,
      boardId: '',

      board: `5'8" Rusty Dwart`,
      paymentStatus: '',
      status: '',
      boardAlreadySold: false,
      boardRegion: '',
      boardCity: ''
    };
  }

  handlePayment() {
    this.setState({
      buttonClicked: true
    });
    const handler = StripeCheckout.configure({
      key: 'pk_live_4MuZBQJz1AkWqEQ7bR0pfjmI',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      zipCode: true,
      token: function(token) {
        // const url = 'http://localhost:8081';
        // const prod 'https://surfclub-api.herokuapp.com';
        const url =  'https://surfclub-api.herokuapp.com';

        fetch(
          `${url}/payment?token=${
            token.id
          }&stripeUser=${this.state.stripeUser}&amount=${this.state.amount}`
        )
          .then(function(response) {
            return response.json();
          })
          .then(
            function(r) {
              console.log('PAYMENT OBJECT FROM API', r);
              console.log('PAYMENT STATUS', r.status);

              const isPaid = r.paid;
              const status = r.status;

              const cardInfo = r.source;
              const last4 = cardInfo.last4;
              const ccType = cardInfo.brand;

              if (isPaid && status === 'succeeded') {
                this.setState({
                  status: 'succeeded'
                });

                // hit the mail BG mail api.

                // to seller
                const shortMessage = `${
                  this.props.account_username
                } has purchased ${
                  this.state.board
                }! Visit your account to message and arrange delivery or pickup!`;

                fetch(
                  `${url}/seller-sold-a-board?email=${
                    this.state.sellerEmail
                  }&username=${
                    this.props.account_username
                  }&bodySnippet=${shortMessage}`
                ).then(function(response) {
                  console.log('PAYMENT TO SELLER EMAIL RESPONSE', response);
                });

                // to buyer
                const buyerMessage = `congrats on your purchase of ${
                  this.state.board
                } from ${
                  this.state.sellerUsername
                }! Visit your account to message and arrange delivery or pickup!`;

                console.log('SELLER USERNAME', this.state.sellerUsername);

                fetch(
                  `${url}/buyer-bought-a-board?email=${
                    this.props.currentUserEmail
                  }&username=${
                    this.props.account_username
                  }&bodySnippet=${buyerMessage}`
                ).then(function(response) {
                  console.log('PURCHASE FROM BUYER EMAIL RESPONSE', response);
                });

                // Update offers/boardid/ meta..
                var updates = {};
                updates[`offers/${this.state.boardId}/paidFor`] = true;
                updates[
                  `offers/${this.state.boardId}/paidBy`
                ] = this.props.account_username;
                updates[
                  `offers/${this.state.boardId}/paidById`
                ] = this.props.userId;
                updates[`offers/${this.state.boardId}/paidOn`] = Date.now();
                updates[
                  `offers/${this.state.boardId}/amountPaid`
                ] = this.state.amount;

                updates[
                  `boardsByRegion/${this.state.boardRegion}/${
                    this.state.boardId
                  }/sold`
                ] = true;
                updates[
                  `boardsByRegion/${this.state.boardRegion}/${
                    this.state.boardId
                  }/amountSoldFor`
                ] = this.state.amount;

                updates[
                  `boardsByCity/${this.state.boardCity}/boards/${
                    this.state.boardId
                  }/sold`
                ] = true;
                updates[
                  `boardsByCity/${this.state.boardCity}/boards/${
                    this.state.boardId
                  }/amountSoldFor`
                ] = this.state.amount;

                updates[
                  `allBoardsList/boards/${this.state.boardId}/sold`
                ] = true;
                updates[
                  `allBoardsList/boards/${this.state.boardId}/amountSoldFor`
                ] = this.state.amount;

                updates[
                  `boardsByUser/${this.state.sellerId}/${
                    this.state.boardId
                  }/sold`
                ] = true;
                updates[
                  `boardsByUser/${this.state.sellerId}/${
                    this.state.boardId
                  }/amountSoldFor`
                ] = this.state.amount;

                // Add to buyers Purchased node..
                updates[
                  `/users/${this.props.userId}/purchases/${
                    this.state.boardId
                  }/boardId`
                ] = this.state.boardId;

                updates[
                  `/users/${this.props.userId}/purchases/${
                    this.state.boardId
                  }/board`
                ] = this.state.board;

                updates[
                  `/users/${this.props.userId}/purchases/${
                    this.state.boardId
                  }/sellerId`
                ] = this.state.sellerId;

                updates[
                  `/users/${this.props.userId}/purchases/${
                    this.state.boardId
                  }/sellerUsername`
                ] = this.state.sellerUsername;

                updates[
                  `/users/${this.props.userId}/purchases/${
                    this.state.boardId
                  }/sellerEmail`
                ] = this.state.sellerEmail;

                updates[
                  `/users/${this.props.userId}/purchases/${
                    this.state.boardId
                  }/pricePaid`
                ] = this.state.amount;

                console.log(
                  `amount ${this.state.amount}`,
                  `seller email ${this.state.sellerEmail}`,
                  `board id ${this.state.boardId}`,
                  `board name ${this.state.board}`,
                  `seller id ${this.state.sellerId}`,
                  `seller user name ${this.state.sellerUsername}`,
                  `account user name ${this.props.account_username}`
                );

                // PUSH MESSAGE IN BOTH BUYER AND SELLER'S INBOXES..

                let messageThreadId =
                  this.state.sellerId +
                  '-' +
                  this.props.userId +
                  '-' +
                  this.state.boardId;

                const singleMessageId = Date.now();

                let purchaseMessage;

                purchaseMessage = `I've just purchased your ${
                  this.state.board
                }, let's set up delivery/pickup arrangements!`;

                // set message for seller ...

                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/date`
                ] = singleMessageId;
                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/isBuyer`
                ] = false;
                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/isSeller`
                ] = true;
                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/from`
                ] = this.props.userId;
                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/to`
                ] = this.state.sellerId;
                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/otherUsername`
                ] = this.props.account_username;
                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/otherPersonsUserId`
                ] = this.props.userId;
                updates[
                  `users/${
                    this.state.sellerId
                  }/messages/${messageThreadId}/${singleMessageId}/message`
                ] = purchaseMessage;

                // set message for buyer ...

                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/date`
                ] = singleMessageId;
                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/isBuyer`
                ] = true;
                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/isSeller`
                ] = false;
                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/from`
                ] = this.props.userId;
                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/to`
                ] = this.state.sellerId;
                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/otherUsername`
                ] = this.state.sellerUsername;
                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/otherPersonsUserId`
                ] = this.state.sellerId;
                updates[
                  `users/${
                    this.props.userId
                  }/messages/${messageThreadId}/${singleMessageId}/message`
                ] = purchaseMessage;

                // message previews for both..
                updates[
                  '/users/' + this.state.sellerId + '/hasNotifications'
                ] = true;
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/otherPersonsUserId'
                ] = this.props.userId;
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/messageType'
                ] =
                  'SELL';
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/lastMessage'
                ] = purchaseMessage;
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/from'
                ] = this.props.userId;
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/read'
                ] = false;
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/lastMessageDate'
                ] = singleMessageId;
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/boardName'
                ] = this.state.board;
                updates[
                  '/users/' +
                    this.state.sellerId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/buyerUser'
                ] = this.props.account_username;

                updates[
                  '/users/' + this.props.userId + '/hasNotifications'
                ] = true;
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/otherPersonsUserId'
                ] = this.state.sellerId;
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/messageType'
                ] =
                  'BUY';
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/lastMessage'
                ] = purchaseMessage;
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/to'
                ] = this.state.sellerId;
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/read'
                ] = false;
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/lastMessageDate'
                ] = singleMessageId;
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/boardName'
                ] = this.state.board;
                updates[
                  '/users/' +
                    this.props.userId +
                    '/messagePreviews/' +
                    messageThreadId +
                    '/sellerUser'
                ] = this.state.sellerUsername;

                console.log(
                  `user id ${this.props.userId}`,
                  `message ${purchaseMessage}`,
                  `single message ${singleMessageId}`,
                  `board name ${this.state.board}`,
                  `seller id ${this.state.sellerId}`,
                  `seller user name ${this.state.sellerUsername}`,
                  `account user name ${this.props.account_username}`
                );

                console.log('UPDATESSSS', updates);

                fire
                  .database()
                  .ref()
                  .update(updates);
              } else {
                // show message that something didn't go through. Don't update anything on the board status.
              }
            }.bind(this)
          )
          .catch(function(ex) {
            console.log('parsing failed', ex);
            // show message that something didn't go through. Don't update anything on the board status.
          });
      }.bind(this)
    });

    handler.open({
      name: 'SURF CLUB',
      description: this.state.board,
      amount: this.state.amount
    });
  }

  componentDidMount() {
    const sellerId = this.getQueryVariable('sellerId');
    const boardId = this.getQueryVariable('boardId');
    const boardName = this.getQueryVariable('boardName');
    const amount = this.getQueryVariable('amount');

    // First check if this board has _just_ sold.

    fire
      .database()
      .ref(`offers/${boardId}`)
      .once('value')
      .then(
        function(s) {
          var offerDetails = s.val();

          if (offerDetails.paidFor === false) {
            fire
              .database()
              .ref('users/' + sellerId)
              .once('value')
              .then(
                function(snapshot) {
                  this.setState({
                    amount: amount,
                    boardId: boardId,
                    stripeUser: snapshot.val().stripe,
                    sellerUsername: snapshot.val().username,
                    sellerId: sellerId,
                    sellerEmail: snapshot.val().email,
                    buyerEmail: this.props.currentUserEmail,
                    amount: parseFloat(amount),
                    board: decodeURIComponent(boardName)
                  });
                }.bind(this)
              );

            // Get Board Meta..
            fire
              .database()
              .ref(`/allBoardsList/boards/${boardId}`)
              .once('value')
              .then(
                function(s) {
                  this.setState({
                    boardRegion: s.val().region,
                    boardCity: s.val().city
                  });
                }.bind(this)
              );
          } else {
            this.setState({
              boardAlreadySold: true
            });
            // Send an email to the BG Team that this buyer was just about to checkout with this board,
            // and got snaked.
          }
        }.bind(this)
      );
  }

  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  render() {
    let amountToShow = parseFloat(this.state.amount) / 100;

    return (
      <div>
        <div className="page-header">
          <b className="t-sans">Payment</b>
        </div>
        <div className="site-container">
          {this.state.boardAlreadySold ? (
            <div>
              <div className="f-28 t-sans  m-b-20">
                Bummer, looks like you just got snaked.
              </div>
              <div className="f-16 t-sans m-b-20">
                However, there are plenty of boards in the sea.{' '}
                <Link to="/buy-boards" className="fc-green">
                  Let's find you another.
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {this.state.status === 'succeeded' ? (
                <div>
                  <div className="f-28 t-sans ls-2 fw-300 m-b-20">
                    Payment Succeeded!
                  </div>
                  <div className="f-16 t-sans">
                    Payment has been sent, and we've notified the seller that
                    you're all squared away. If you haven't already, now is the
                    time to message them and arrange your pickup / shipment.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="f-16 t-sans">
                    You're one step closer to getting your hands on that new
                    (used) board! Just click the payment button below, fill out
                    your card info, and that's it. We'll send a notification to
                    the seller that you're all squared away, and that the two of
                    you can continue confidently through your transaction.
                  </div>
                  <hr />
                  <div className="f-16 t-sans">
                    {' '}
                    <span className="fw-300">Board:</span> {this.state.board}{' '}
                  </div>
                  <div className="f-16 t-sans">
                    {' '}
                    <span className="fw-300">Seller:</span>{' '}
                    {this.state.sellerUsername}
                  </div>
                  <div className="f-16 t-sans m-b-20">
                    {' '}
                    <span className="fw-300">Amount:</span> ${amountToShow}
                  </div>
                  <hr />
                  <div className="f-16 t-sans">
                    {' '}
                    <span className="fw-300">Stripe User:</span>{' '}
                    {this.state.stripeUser}
                  </div>
                  <div className="f-16 t-sans">
                    {' '}
                    <span className="fw-300">Seller Email:</span>{' '}
                    {this.state.sellerEmail}
                  </div>
                  <div className="f-16 t-sans">
                    {' '}
                    <span className="fw-300">Seller ID:</span>{' '}
                    {this.state.sellerId}
                  </div>
                  <div className="f-16 t-sans">
                    {' '}
                    <span className="fw-300">Buyer Email:</span>{' '}
                    {this.state.buyerEmail}
                  </div>

                  <div className="f-16 t-sans">
                    {' '}
                    <span className="fw-300">Board City:</span>{' '}
                    {this.state.boardCity}
                  </div>

                  <button
                    className="message-box__button"
                    style={{ marginTop: '22px' }}
                    onClick={() => this.handlePayment()}
                  >
                     Pay ${amountToShow}
                  </button>
                </div>
              )}
            </div>
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
  allBoardsList,
  currentUserEmail
}) => {
  return {
    userId,
    userAuthenticated,
    account_username,
    firstTimeLogin,
    allBoardsList,
    currentUserEmail
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

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
