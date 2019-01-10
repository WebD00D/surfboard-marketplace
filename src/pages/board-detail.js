import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import fire from '../fire';
import '../layouts/css/site.css';
import '../layouts/css/board.css';
import '../layouts/css/fcss.css';
import Link from 'gatsby-link';
import { connect } from 'react-redux';

import Disqus from '../components/Disqus';

class BoardDetail extends PureComponent {
	constructor(props) {
		super(props);

		this.sendMessage = this.sendMessage.bind(this);
		this.sendOffer = this.sendOffer.bind(this);

		this.state = {
			boardId: '',
			board: {},
			isQuestion: false,
			isOffer: false,
			message: '',
			offer: 0,
			messageStatus: '',
			messageId: false,
			sellerUserName: '',
			sellerEmail: '',
		};
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


		//localStorage.setItem('boardgrab_user', user.uid);


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


		// get board param id
		const id = this.getQueryVariable('board');

		fire
			.database()
			.ref(`/allBoardsList/boards/${id}`)
			.once('value')
			.then(
				function(snapshot) {
					console.log('SNAPSHOT', snapshot.val());
					this.setState({
						boardId: id,
						board: snapshot.val()
					});

					const sellerId = snapshot.val().userId;

					fire
						.database()
						.ref(`/users/${sellerId}`)
						.once('value')
						.then(
							function(s) {
								console.log('SELLER SNAPSHOT', s.val());
								this.setState({
									sellerUserName: s.val().username,
									sellerEmail: s.val().email
								});
							}.bind(this)
						);
				}.bind(this)
			);
	}

	sendOffer() {


		const shortMessage = `${this.props.account_username} has sent an offer for ${this.state.board.name}! Visit your account to view!`

		fetch(
			`https://boardgrab-api.herokuapp.com/send-message-or-offer-to-seller?email=${this.state.sellerEmail}&username=${this.props.account_username}&bodySnippet=${shortMessage}`
		).then(function(response) {
			console.log("SEND OFFER EMAIL RESPONSE", response);
		});


		const sellerId = this.state.board.userId;
		const buyerId = this.props.userId;
		const offer = this.state.offer;
		const boardId = this.state.boardId;

		const offerId = buyerId + "-" + boardId;

		var updates = {};
		updates[`offers/${boardId}/paidFor`] = false;
		updates[`offers/${boardId}/paidBy`] = '';
		updates[`offers/${boardId}/paidOn`] = '';
		updates[`offers/${boardId}/amountPaid`] = 0;
		updates[`offers/${boardId}/paymentPending`] = false;

		// updagte the boardname on the sellers offer node
		updates[`users/${sellerId}/offersReceived/${boardId}/name`] = this.state.board.name;

		fire
		.database()
		.ref()
		.update(updates);

		fire
			.database()
			.ref(`offers/${boardId}/offersMade/${offerId}`)
			.set({
				offerDate: Date.now(),
				buyerId: buyerId,
				buyerUsername: this.props.account_username,
				amount: offer,
				boardName: this.state.board.name,
				offerAccepted: false
			})


		// SET OFFERS RECEIVED NODE FOR SELLER
		fire
			.database()
			.ref(`users/${sellerId}/offersReceived/${boardId}/offers/${offerId}`)
			.set({
				boardId: boardId,
				boardName: this.state.board.name,
				buyerId: this.props.userId,
				buyerUsername: this.props.account_username,
				amountOffered: offer,
				offerDate: Date.now(),
				boardName: this.state.board.name,
				offerAccepted: false
			})

		// SET OFERS MADE NODE FOR BUYER

		fire
		.database()
		.ref(`users/${this.props.userId}/offersMade/${boardId}`)
		.set({
			boardId: boardId,
			boardName: this.state.board.name,
			sellerId: sellerId,
			sellerUsername: this.state.sellerUserName,
			amountOffered: offer,
			offerDate: Date.now(),
			boardName: this.state.board.name,
			offerAccepted: false
		})

		this.setState({ messageStatus: 'Message Sent!' });

				setTimeout(
					function() {
						this.setState({
							messageStatus: '',
							isQuestion: false,
							isOffer: false
						});
					}.bind(this),
					2000
				);

	} // end Send Offer

	sendMessage() {


		const sellerId = this.state.board.userId;
		const buyerId = this.props.userId;
		const message = this.state.message;
		const messageDate = new Date();


		const shortMessage = `${this.props.account_username} has asked a question about ${this.state.board.name}! Visit your account to view and reply!`

		fetch(
			`https://boardgrab-api.herokuapp.com/send-message-or-offer-to-seller?email=${this.state.sellerEmail}&username=${this.props.account_username}&bodySnippet=${shortMessage}`
		).then(function(response) {
			console.log("SEND QUESTION EMAIL RESPONSE", response);
		});


		let messageThreadId = this.state.messageId
			? this.state.messageId
			: sellerId + '-' + buyerId + '-' + this.state.boardId;
		const singleMessageId = Date.now();

		// Set for Seller
		fire
			.database()
			.ref('users/' + sellerId + '/messages/' + messageThreadId + '/' + singleMessageId)
			.set({
				date: singleMessageId,
				isBuyer: false,
				isSeller: true,
				from: buyerId,
				to: sellerId,
				message: message,
				otherUsername: this.props.account_username,
				otherPersonsUserId: this.props.userId
			});

		// Set for Potential Buyer
		fire
			.database()
			.ref('users/' + buyerId + '/messages/' + messageThreadId + '/' + singleMessageId)
			.set({
				date: singleMessageId,
				isBuyer: true,
				isSeller: false,
				from: buyerId,
				to: sellerId,
				otherUsername: this.state.sellerUserName,
				otherPersonsUserId: this.state.board.userId,
				message: message
			});

		// MESSAGE PREVIEWS.. These are what we will pull from in the user's account, that just show a snapshot of the latest message.

		var updates = {};
		updates['/users/' + sellerId + '/hasNotifications'] = true;
		updates['/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/otherPersonsUserId'] = this.props.userId;
		updates['/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/messageType'] = 'SELL';
		updates['/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/lastMessage'] = message;
		updates['/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/from'] = buyerId;
		updates['/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/read'] = false;
		updates['/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/lastMessageDate'] = messageDate;
		updates['/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/boardName'] = this.state.board.name;
		updates[
			'/users/' + sellerId + '/messagePreviews/' + messageThreadId + '/buyerUser'
		] = this.props.account_username;

		updates['/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/otherPersonsUserId'] = this.state.board.userId;
		updates['/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/messageType'] = 'BUY';
		updates['/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/lastMessage'] = message;
		updates['/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/to'] = sellerId;
		updates['/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/read'] = true;
		updates['/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/lastMessageDate'] = messageDate;
		updates['/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/boardName'] = this.state.board.name;
		updates[
			'/users/' + buyerId + '/messagePreviews/' + messageThreadId + '/sellerUser'
		] = this.state.sellerUserName;

		fire
			.database()
			.ref()
			.update(updates);

		this.setState({ messageStatus: 'Message Sent!' });

		setTimeout(
			function() {
				this.setState({
					messageId: messageThreadId,
					messageStatus: '',
					isQuestion: false,
					isOffer: false
				});
			}.bind(this),
			2000
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
		return (
			<div className="site-container">

			<div className="ad-container" style={{paddingLeft: '0px', paddingRight: '0px'}}>
				<a href="https://us.billabong.com/shop/mens-boardshorts">
					<img
						className="ad"
						src="https://us.billabong.com/media/transfer/img/lbib_unplug_hp_banner.jpg"
					/>
				</a>
			</div>

				{this.state.isOffer || this.state.isQuestion ? (
					<div className="inquiry-popup">
						<div className="message-box">
							<a
								href="#"
								style={{ color: '#404040' }}
								onClick={() => {
									this.setState({ isOffer: false, isQuestion: false });
								}}
							>
								<i
									className="fa fa-close"
									style={{ fontSize: '13px', position: 'absolute', right: '10px', top: '10px' }}
								/>
							</a>
							<div className="message-box__content">
								{this.props.userAuthenticated ? (
									<div>
										<div className="message-box__header">
											{this.state.isOffer ? 'Make an Offer' : 'Ask a Question'}
										</div>
										<div className="t-sans f-13 lh-18" style={{ opacity: '0.6' }}>
											{' '}
											Do not send payments offsite. If you do not pay through Boardgrab you are
											not eligible for Boardgrab or Stripe Fraud Protection.
										</div>
										{this.state.isQuestion ? (
											<div>
												<textarea
													className="message-box__textarea"
													onChange={e => {
														this.setState({ message: e.target.value });
													}}
												/>
												<button
													onClick={() => this.sendMessage()}
													className="message-box__button"
												>
													Send
												</button>
											</div>
										) : (
											<div>
											<div className="t-sans f-13 lh-18" style={{ opacity: '0.6', marginTop: '20px' }}>
											{' '}
											If seller will ship, make sure to include shipping cost in your offer! If you do not know
											the shipping cost, message them to get a price.
											</div>
												<input
													type="number"
													className="message-box__input"
													onChange={ e => {
														this.setState({ offer: e.target.value })
													} }
													 />
												<button
													onClick={() => this.sendOffer()}
													className="message-box__button"
												>
													Send Offer
												</button>
											</div>
										)}
									</div>
								) : (
									<div>
										<div className="message-box__header" style={{ marginBottom: '20px' }}>
											Please sign in or register!
										</div>
										<div
											className="t-sans f-13 lh-18"
											style={{ opacity: '0.6', marginBottom: '28px' }}
										>
											To inquire or make an offer on this board, you must have an active Boardgrab
											account.
										</div>
										<Link
											to="/authentication"
											style={{
												textDecoration: 'none',
												lineHeight: '38px',
												display: 'block',
												textAlign: 'center'
											}}
											className="message-box__button"
										>
											Sign In / Register
										</Link>
									</div>
								)}

								<div className="t-sans f-13 fc-green ">{this.state.messageStatus}</div>
							</div>
						</div>
					</div>
				) : (
					''
				)}

				<div className="board-info">


					<div className="board-info__column__lg" style={{ paddingLeft: '40px' }}>
						<div className="board-info__header">
							<div className="board-info__title">{this.state.board.name}

							</div>

							<div className="board-info__location">
								<span>{this.state.board.city}, </span>
								<span>{this.state.board.region}</span>
							</div>
							<div className="board-info__short-desc">
								Sold by <b className="fc-green">{this.state.sellerUserName}</b>
							</div>
							{ this.state.board.sold
							? <div style={{ fontSize: '28px',  marginTop: '12px', fontWeight: '500' }} className="fc-red t-sans">SOLD</div>
							: <div style={{ fontSize: '28px',  marginTop: '12px', fontWeight: '500' }} className="fc-green t-sans">${this.state.board.price}</div>
							 }
						</div>

						<div className="board-info__price" style={{ borderBottom: 'none', marginBottom: '0px' }}>


							{ this.state.board.sold
							? ''
							: <div>
								<div><button
									onClick={() => {
										this.setState({ isOffer: false, isQuestion: true });
									}}
									style={{ backgroundColor: '#498144', marginRight: '8px' }}
								>
									Ask a Question
								</button></div>
								<div><button
									onClick={() => {
										this.setState({ isOffer: true, isQuestion: false });
									}}
								>
									Make an Offer
								</button></div>
							</div>
							}


						</div>

						<div className="board-info__tags" style={{ marginTop: '0px' }}>
							<label style={{ display: 'block', width: '100%' }}>Perfect For: </label>

							{this.state.board.tag_advanced ? <div className="board-info__tag">Advanced Rider</div> : ''}
							{this.state.board.tag_beginner ? <div className="board-info__tag">Beginners</div> : ''}
							{this.state.board.tag_greatforanybody ? <div className="board-info__tag">Anybody</div> : ''}
							{this.state.board.tag_intermediate ? (
								<div className="board-info__tag">Intermediate Rider</div>
							) : (
								''
							)}
							{this.state.board.tag_budget ? <div className="board-info__tag">On a Budget</div> : ''}
							{this.state.board.tag_smallwaves ? <div className="board-info__tag">Small Waves</div> : ''}
						</div>

						<div className="board-info__section">

							<div className="board-info__section-row t-sans f-16">
								<label className="fw-500 t-upper ls-2 f-11 mw-150p">Dimensions:</label>
								<span  className="fc-green f-11 t-upper ls-2">
									{this.state.board.dimensions}
								</span>
							</div>
							<div className="board-info__section-row t-sans f-16">
								<label className="fw-500 t-upper ls-2 f-11 mw-150p">Fin Setup:</label>
								<span  className="fc-green f-11 t-upper ls-2">
									{this.state.board.fins}-Fin
								</span>
							</div>
							<div className="board-info__section-row t-sans f-16">
								<label className="fw-500 t-upper ls-2 f-11 mw-150p">Volume:</label>
								<span  className="fc-green f-11 t-upper ls-2">
									{this.state.board.volume} Liters
								</span>
							</div>
						</div>

						{/* <div className="board-info__section b-top-solid p-t-18">
							<div className="board-info__section-row t-sans f-16 fx-a-end">
								<div className="about-seller">
									About the seller, <br /> Bailey
								</div>
								<span style={{ marginLeft: '14px' }}>
									Bailey has grown up and lived in Venice Beach all his life, surfing most if not
									every day. Favorite board is a GH, and favorite surfer (for obvious reasons) is
									Jordy Smith.
								</span>
							</div>
						</div> */}

						<div className="board-info__section b-top-solid p-t-18">
							<div className="board-info__section-row t-sans f-16 fx-a-end">
								<div className="fw-500 t-upper ls-2 f-11 mw-150p">Description</div>
								<span  className="f-11 t-upper ls-2">
									{this.state.board.description}
								</span>
							</div>
						</div>

						<div className="board-info__section b-top-solid p-t-18">
							<div className="board-info__section-row t-sans f-16 fx-a-end">
								<div className="fw-500 t-upper ls-2 f-11 mw-150p">Condition</div>
								<span className="f-11 t-upper ls-2">
									{this.state.board.condition}
								</span>
							</div>
						</div>

						<div className="board-info__section b-top-solid p-t-18">
							<div className="board-info__section-row t-sans f-16 fx-a-end">
								<div className="fw-500 t-upper ls-2 f-11 mw-150p">Shaper Info</div>
								<span  className="f-11 t-upper ls-2">
									{this.state.board.shaperInfo}
								</span>
							</div>
						</div>
					</div>

					<div className="board-info__column__sm">
						<img className="hover" style={{ borderRadius: '4px' }} src={this.state.board.featurePhotoURL} />

						<div className="board-info__images">
							<div
								className="board-info__image hover"
								style={{ backgroundImage: 'url(' + this.state.board.photoOne + ')' }}
							/>
							<div
								className="board-info__image"
								style={{ backgroundImage: 'url(' + this.state.board.photoTwo + ')' }}
							/>
							<div
								className="board-info__image"
								style={{ backgroundImage: 'url(' + this.state.board.photoThree + ')' }}
							/>
							<div
								className="board-info__image"
								style={{ backgroundImage: 'url(' + this.state.board.photoFour + ')' }}
							/>
							<div
								className="board-info__image"
								style={{ backgroundImage: 'url(' + this.state.board.photoFive + ')' }}
							/>
							<div
								className="board-info__image"
								style={{ backgroundImage: 'url(' + this.state.board.photoSix + ')' }}
							/>
						</div>
					</div>
				</div>

				<Disqus title="Board Comments" shortname="boardgrab-comments" identifier={this.state.boardId} />
			</div>
		);
	}
}

const mapStateToProps = ({ userId, userAuthenticated, account_username, firstTimeLogin, allBoardsList }) => {
	return { userId, userAuthenticated, account_username, firstTimeLogin, allBoardsList };
};

const mapDispatchToProps = dispatch => {
	return {
		createAndSignInUser: (userId, account_username) =>
			dispatch({ type: `CREATE_AND_SIGNIN_USER`, userId, account_username }),
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
	      }),
		getAllBoards: boards => dispatch({ type: `GET_ALL_BOARDS`, boards })

	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardDetail);
