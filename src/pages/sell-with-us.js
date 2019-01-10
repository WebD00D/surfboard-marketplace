import React from "react";
import "../layouts/css/site.css";
import "../layouts/css/stripe.css";


// <a
//   href="https://connect.stripe.com/express/oauth/authorize?redirect_uri=http://localhost:8000/seller-confirmation/&client_id=ca_BktaykED2idsi5jlNomAw6kFOPYn9af2&state=VA"
//   className="stripe-connect"
// >
//   <span>Connect with Stripe</span>
// </a>

const SellWithUs = () => (
  <div>
  <div className="page-header">
      <b className="t-sans">Selling with Boardgrab</b>
  </div>
  <div className="site-container">
    <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
      Boardgrab uses Stripe as our payment system. It’s just like PayPal, but
      even easier! Click the button below to allow people to pay you! If you
      don’t want more money, click the back button to return to the Boardgrab
      homepage.
    </p>
    <a
      href="https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://boardgrab.com/seller-confirmation/&client_id=ca_BktaTD2varxECptx8xVW0L90N9YibTE1&state=VA"
      className="stripe-connect"
    >
      <span>Connect with Stripe</span>
    </a>

  </div>
  </div>
);

export default SellWithUs;
