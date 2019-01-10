import React, { PureComponent } from "react";

import PropTypes from "prop-types";
import Link from "gatsby-link";
import Helmet from "react-helmet";

import "./index.css";
import Navbar from "../components/Navbar";
import fire from '../fire';

import { connect } from "react-redux";

const Counter = ({ count, increment }) => (
  <div>
    <p>Count: {count} </p>
    <button onClick={increment}>Increment</button>
  </div>
)

const mapStateToProps = ({ count }) => {
  return { count }
}

const mapDispatchToProps = dispatch => {
  return { increment: () => dispatch({ type: `INCREMENT` }) }
}

const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter)

class TemplateWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Helmet
          title="Surf Club"
          meta={[
            { name: "description", content: "The best place to buy and sell used surfboards" },
            { name: "keywords", content: "surfing, surfboards" }
          ]}
        />
        <Navbar />
        {/* <ConnectedCounter /> */}
        <div className="nav-container">
        {this.props.children()}
      </div>
      </div>
    );
  }
}


TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;
