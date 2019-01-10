import React, { PureComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import fire from "../fire";
import "../layouts/css/site.css";
import "../layouts/css/board.css";
import "../layouts/css/fcss.css";
import "../layouts/css/tables.css";
import cx from "classnames";
import Link from "gatsby-link";
import Moment from "react-moment";
import _ from "lodash";
import { connect } from "react-redux";

class Message extends PureComponent {
  constructor(props) {
    super(props);

    this.sendMessage = this.sendMessage.bind(this);

    this.state = {
      messageThread: [],
      messageId: "",
      from: "",
      reply: false,
      sendMessageBackTo: '',
      otherUser: '',
      board: '',
      sendMessageBackToEmail: '',
      sendToUser: ''
    };
  }


  componentDidMount() {


    // get board param id
    const sendMessageTo = this.getQueryVariable("from");
    this.setState({
      sendMessageBackTo: sendMessageTo
    })

    fire
      .database()
      .ref("users/" + sendMessageTo)
      .once("value")
      .then(
        function(snapshot) {
          console.log("OTHER USER SNAPSHOT", snapshot.val());
          this.setState({
            sendMessageBackToEmail: snapshot.val().email,
            sendToUser: snapshot.val().username
          })
        }.bind(this)
      );


      const id = this.getQueryVariable("message");
      const from = this.getQueryVariable("from");
      const otherUser = this.getQueryVariable("otherUser");
      const board = this.getQueryVariable("board")


      console.log("FROM", from);

      var updates = {};
      updates[
        "/users/" + this.props.userId + "/messagePreviews/" + id + "/read"
      ] = true;
      fire
        .database()
        .ref()
        .update(updates);

      var messageRef = fire
        .database()
        .ref(`/users/${this.props.userId}/messages/${id}`);
      messageRef.on(
        "value",
        function(snapshot) {
          console.log("messages", snapshot.val());
          this.setState({
            messageThread: snapshot.val(),
            messageId: id,
            message: '',
            otherUser: otherUser,
            board: board
          });
        }.bind(this)
      );



  }

  getQueryVariable(variable) {

    // BUG: Failing on Netlify deploy. Window is not defined.
    // NOTE: I though since this was in componentDidMount that window would be available.
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

  sendMessage() {

    const shortMessage = this.state.message.substr(0,30) + "...";

    fetch(
      `https://boardgrab-api.herokuapp.com/send-message-notification?email=${this.state.sendMessageBackToEmail}&username=${this.props.account_username}&bodySnippet=${shortMessage}`
    ).then(function(response) {
      console.log("RESPONSE", response);
    });

		const message = this.state.message;
		const messageDate = new Date();
		let messageThreadId = this.state.messageId;
    const singleMessageId = Date.now();

		// Set for current
		fire
			.database()
			.ref('users/' + this.props.userId + '/messages/' + messageThreadId + '/' + singleMessageId)
			.set({
				date: singleMessageId,
				from: this.props.userId,
				to: this.state.from,
				message: message,
				otherUsername: this.props.account_username,
			});

		// Set for reply to
		fire
			.database()
			.ref('users/' + this.state.sendMessageBackTo + '/messages/' + messageThreadId + '/' + singleMessageId)
			.set({
				date: singleMessageId,
        from: this.props.userId,
				to: this.state.sendMessageBackTo,
				otherUsername: this.props.account_username,
				message: message,
			});

		// MESSAGE PREVIEWS.. These are what we will pull from in the user's account, that just show a snapshot of the latest message.

		var updates = {};

    // FOR CURRENT USERS HISTORY
		updates['/users/' + this.props.userId + '/messagePreviews/' + messageThreadId + '/lastMessage'] = message;
		updates['/users/' + this.props.userId + '/messagePreviews/' + messageThreadId + '/from'] = this.props.userId;
		updates['/users/' + this.props.userId + '/messagePreviews/' + messageThreadId + '/read'] = true;
    updates['/users/' + this.props.userId + '/messagePreviews/' + messageThreadId + '/lastMessageDate'] = messageDate;

    // PERSON THEY ARE SENDING THIS MESSAGE TO
    updates['/users/' + this.state.sendMessageBackTo + '/hasNotifications'] = true;
		updates['/users/' + this.state.sendMessageBackTo + '/messagePreviews/' + messageThreadId + '/lastMessage'] = message;
		updates['/users/' + this.state.sendMessageBackTo + '/messagePreviews/' + messageThreadId + '/to'] = this.state.sendMessageBackTo;
		updates['/users/' + this.state.sendMessageBackTo + '/messagePreviews/' + messageThreadId + '/read'] = false;
    updates['/users/' + this.state.sendMessageBackTo + '/messagePreviews/' + messageThreadId + '/lastMessageDate'] = messageDate;


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
					reply: false,
				});
			}.bind(this),
			2000
		);
	}

  render() {

    console.log( 'MESSAGE THREAD',  this.state.messageThread )

  //  let otherUser = this.state.messageThread[0].otherUsername;

    let messages = [];

    messages = Object.keys(this.state.messageThread).map(
      function(key) {

        return (
          <div key={key} className={cx(["message-row t-sans f-13", {  "bg-light-grey" : this.state.messageThread[key].from === this.props.userId}])}>
            <div className="fx fx-col">
              <div>{this.state.messageThread[key].message}</div>
              <div>
                {
                  this.state.messageThread[key].from === this.props.userId
                  ? <div className="fw-500 f-11 t-sans">Me</div>
                  : <div className="fw-500 f-11 t-sans">{this.state.messageThread[key].otherUsername}</div>

                 }
              </div>
            </div>
            <div>
              { this.state.messageThread[key].date
                ? <Moment format="MM/DD/YYYY hh:mm A" date={this.state.messageThread[key].date} />
                : ''
              }

            </div>
          </div>
        );
      }.bind(this)
    );



    let newMessages = _.reverse(messages);

    // Object.keys(this.props.boardsToDisplay).map(function(key) {
    //   return <Link key={key} style={{textDecoration: 'none', color: '#404040'}} to={`/board-detail/?board=${key}`} ><Board key={`boards-${Number(key)}`} board={this.props.boardsToDisplay[key]} /> </Link>
    // }.bind(this));

    return (
      <div>
      <div className="page-header">
          <b className="t-sans">{decodeURIComponent(this.state.board)}</b>
      </div>
      <div className="site-container">


        {
          this.state.reply
          ?
          <div className="inquiry-popup">
            <div className="message-box">
              <a
                href="#"
                style={{ color: '#404040' }}
                onClick={() => {
                  this.setState({ reply: false });
                }}
              >
                <i
                  className="fa fa-close"
                  style={{ fontSize: '13px', position: 'absolute', right: '10px', top: '10px' }}
                />
              </a>
              <div className="message-box__content">
                  <div>
                    <div className="message-box__header">
                      Reply
                    </div>
                    <div className="t-sans f-13 lh-18" style={{ opacity: '0.6' }}>
                      {' '}
                      Do not send payments offsite. If you do not pay through Boardgrab you are
                      not eligible for Boardgrab or Stripe Fraud Protection.
                    </div>

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

                  </div>

                <div className="t-sans f-13 fc-green ">{this.state.messageStatus}</div>
              </div>
            </div>
          </div>
          : ''
         }



        <Link
          to="/account"
          className="td-none fc-green t-sans t-upper f-11 ls-2"
        >
          Back to Messages
        </Link>

        <div className="message-header">
          <div className="f-13 fw-500 t-sans" style={{marginLeft: "8px"}}>{this.state.sendToUser} </div>
          <div
            className="f-13 fw-500 t-sans fc-white ls-2 t-upper hover"
            style={{ marginRight: "16px" }}
            onClick={ () => { this.setState({ reply: !this.state.reply }) } }
          >
            Reply
          </div>
        </div>
        {newMessages}
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

export default connect(mapStateToProps, mapDispatchToProps)(Message);
