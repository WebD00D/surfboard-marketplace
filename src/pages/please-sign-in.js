import React from 'react'
import Link from 'gatsby-link'
import "../layouts/css/fcss.css";
import "../layouts/css/login.css";

const PleaseSignIn = () => (
  <div className="login-form">
    <h1 className="t-sans fw-300">See you soon!</h1>
    <Link className="button button--green button--small" to="/">Go to login form</Link>
  </div>
)

export default PleaseSignIn
