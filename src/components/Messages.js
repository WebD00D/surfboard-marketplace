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


class Messages extends PureComponent {

  constructor(props) {
      super(props);

      this.handleMessageTabChange = this.handleMessageTabChange.bind(this);

      this.state = {
        activeTab: 'sell',
        messages: {}
      }

  }

  componentDidMount() {
    // GET ALL USERS MESSAGE PREVIEWS.
    var messageRef = fire.database().ref('/users/' + this.props.userId + '/messagePreviews');

    messageRef.on('value', function(snapshot){
      console.log('MESSSSSAGE PREVIEWZZZ', snapshot.val())
      this.setState({
        messages: snapshot.val()
      })
    }.bind(this))
  }

  handleMessageTabChange (tab) {
    this.setState({
      activeTab: tab
    })
  }


  render() {


    const messages = this.state.messages;

    console.log("MESSAGESSSSS", messages);
    const buyMessages = [];
    const sellMessages = [];

    let buyMessagesReveresed;
    let sellMessagesReversed;

    _.forEach(messages, function(value, key) {


      let userAction;

      if ( value.messageType === "SELL" ) {
        userAction = "SELLING";
      } else  {
        userAction = "BUYING"
      }


      sellMessages.push(
        <Link to={`/message/?message=${key}&from=${value.otherPersonsUserId}&otherUser=${value.sellerUser}&board=${value.boardName}`} key={key} style={{textDecoration: 'none'}} className={cx([ "table-row table-row--messages", {"table-row--unread": !value.read} ])} >
          <div className={cx(["t-sans f-11 ls-2 w-40p fc-green w-100p-m", { "fc-white": !value.read }])}>
          <b>{value.boardName}</b>
          <div><small>{userAction}</small></div>
          </div>
          <div className={cx(["t-sans f-11 ls-2 fw-500 w-40p w-100p-m fc-green", { "fc-white": !value.read }])}>
            <div>{value.lastMessage.substr(0,30)}...</div>
            <div style={{color: '#808080'}}>{value.buyerUser} </div>
          </div>
          <div className={cx(["t-sans f-11  fw-500 ls-2 w-20p w-100p-m t-right t-left-m fx fx-col fc-green", { "fc-white": !value.read }])} style={{paddingRight:'8px'}}>

          <Moment format="MM/DD/YYYY hh:mm A" date={value.lastMessageDate} />

          </div>
        </Link>
      );

      // if ( value.messageType === "SELL") {
      //   sellMessages.push(
      //     <Link to={`/message/?message=${key}&from=${value.otherPersonsUserId}&otherUser=${value.sellerUser}&board=${value.boardName}`} key={key} style={{textDecoration: 'none'}} className={cx([ "table-row", {"table-row--unread": !value.read} ])} >
      //       <div style={{paddingLeft: '8px'}} className={cx(["t-sans f-11 ls-2 w-40p fc-green", { "fc-white": !value.read }])}>
      //         {value.boardName}
      //       </div>
      //       <div className={cx(["t-sans f-11 ls-2 w-40p fc-green", { "fc-white": !value.read }])}>
      //         {value.lastMessage.substr(0,30)}...
      //       </div>
      //       <div className={cx(["t-sans f-11  fw-500 ls-2 w-20p t-right fx fx-col fc-green", { "fc-white": !value.read }])} style={{paddingRight:'8px'}}>
      //         <div>{value.buyerUser}</div>
      //         <div><Moment format="MM/DD/YYYY hh:mm A" date={value.lastMessageDate} /></div>
      //       </div>
      //     </Link>
      //   );
      // } else {
      //   buyMessages.push(
      //
      //     <Link to={`/message/?message=${key}&from=${value.otherPersonsUserId}&otherUser=${value.sellerUser}&board=${value.boardName}`} key={key} style={{textDecoration: 'none'}} className={cx([ "table-row", {"table-row--unread": !value.read} ])} >
      //       <div style={{paddingLeft: '8px'}} className={cx(["t-sans f-11 ls-2 w-40p fc-green", { "fc-white": !value.read }])}>
      //         {value.boardName}
      //       </div>
      //       <div className={cx(["t-sans f-11 ls-2 w-40p fc-green", { "fc-white": !value.read }])}>
      //         {value.lastMessage.substr(0,30)}...
      //       </div>
      //       <div className={cx(["t-sans f-11  fw-500 ls-2 w-20p t-right fx fx-col fc-green", { "fc-white": !value.read }])} style={{paddingRight:'8px'}}>
      //         <div>{value.buyerUser}</div>
      //         <div><Moment format="MM/DD/YYYY hh:mm A" date={value.lastMessageDate} /></div>
      //       </div>
      //     </Link>
      //
      //   );
      // }


    }.bind(this));

    sellMessagesReversed = _.reverse(sellMessages)

    return (
        <div>
          <div className="table-rows">
            {
              sellMessages.length > 0
              ? <div>{sellMessagesReversed}</div>
              : <div className="t-sans f-13 t-center">0 Messages Found</div>
            }
          </div>
        </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
