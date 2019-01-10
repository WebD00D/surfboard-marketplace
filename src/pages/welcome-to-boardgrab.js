import React from 'react';
import "../layouts/css/site.css";
import Link from 'gatsby-link';


const Welcome = () => (
  <div>
  <div className="page-header">
      <b className="t-sans">Welcome to Boardgrab</b>
  </div>
  <div className="site-container" style={{paddingTop: '30px'}}>
    <p className="t-primary" style={{fontWeight: 400, fontSize: 14}}>
    Selling used surfboards has always kind of sucked.
    Paying massive commissions to a third party , or dealing with the inconvenient/shady nuances of Craigslist doesn’t exactly give surfers many options.
    'Until now. Boardgrab is making selling used surfboards suck less.  Sell for free, sell conveniently, and become part of a community of sellers just like you.  Our hope, sellers will work together, share knowledge, and experience to make board selling better for everyone.  Don’t miss out on surfing’s latest revolution, “join here”.
    </p>
    <div style={{display: 'flex'}}>
    <Link to="/buy-boards" className="auth-button">Shop Boards</Link>
    <Link to="/sell-with-us" className="auth-button auth-button auth-button--black" style={{marginLeft: '10px'}}>Start Selling</Link>
    </div>
  </div>
  </div>
)

export default Welcome
