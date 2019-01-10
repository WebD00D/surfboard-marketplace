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

class Settings extends PureComponent {

  constructor(props) {
      super(props);

      this.state = {
        offersMade: {}
      }

  }

  componentDidMount() {
    // GET ALL THE SELLERS OFFERS PER BOARD...
    var messageRef = fire.database().ref('/users/' + this.props.userId + '/offersMade');

    messageRef.on('value', function(snapshot){

      this.setState({
        offersMade: snapshot.val()
      })
    }.bind(this))
  }




  render() {

    const offersMadeDataSource = this.state.offersMade;
    const offersMadeList = [];
    const offersMadeItems = [];

    _.forEach(offersMadeDataSource, function(v, k) {

                console.log('DETAILS ABOUT THE SPECIFIC OFFER', v)



               const amount = (parseFloat(v.amountOffered) * 100);
               const paymentLink = `/pay/?sellerId=${v.sellerId}&boardId=${v.boardId}&boardName=${v.boardName}&amount=${amount}`;


                offersMadeItems.push(

                    <div key={k} style={{marginBottom: '28px'}}>
                        <div className="offers__header">{v.boardName}</div>
                        <div className="offers__row" >
                            <div>
                                <div className="f-16 fw-500">${v.amountOffered}</div>
                                <div><Moment format="MM/DD/YYYY @ hh:mm A" date={v.offerDate} /> to {v.sellerUsername}</div>
                            </div>
                            <div>
                                {
                                    !v.offerAccepted
                                        ? <div className="fc-yellow t-sans fw-500" style={{fontStyle: 'italic', paddingRight: '30px'}}>Offer Pending</div>
                                        :
                                        <div style={{paddingRight: '30px'}}>
                                            <div className="fc-green t-sans fw-500">
                                            Offer Accepted!
                                            <Link className="fc-green" to={paymentLink}>Pay Now!</Link></div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>

                )




        }.bind(this));

        var offersMadeListReversed = _.reverse(offersMadeItems);



	return (<div>
			<div className="table-rows">

				{offersMadeItems.length > 0 ? (
					<div>{offersMadeListReversed}</div>
				) : (
					<div className="t-sans f-13 t-center">0 Offers Made</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
