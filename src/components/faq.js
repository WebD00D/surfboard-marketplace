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
import "../layouts/css/site.css";

class Faq extends PureComponent {

  constructor(props) {
      super(props);

      this.state = {
        open: false
      }
  }

  render() {

    return (
      <div>
        <div className="m-b-30" >
        <b onClick={()=> this.setState({ open: !this.state.open })} className="t-primary hover">{this.props.headline} <i className={cx([ "fa", {"fa-chevron-down": !this.state.open, "fa-chevron-up": this.state.open } ])}></i></b>
        <p className={cx([ "t-primary", {"d-none": !this.state.open} ])} style={{ fontWeight: 400, fontSize: 14 }}>
          {this.props.copy}
        </p>
        </div>
      </div>
    )

  }
}



export default Faq
