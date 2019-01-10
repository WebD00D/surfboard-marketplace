import React from "react";
import Helmet from "react-helmet";

let stylesStr;
if (process.env.NODE_ENV === "production") {
  try {
    stylesStr = require("!raw-loader!../public/styles.css");
  } catch (e) {
    console.log(e);
  }
}

module.exports = props => {
  let css;
  if (process.env.NODE_ENV === "production") {
    css = (
      <style
        id="gatsby-inlined-css"
        dangerouslySetInnerHTML={{ __html: stylesStr }}
      />
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {props.headComponents}
        {css}
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700"
          rel="stylesheet"
        />
        <script src="https://use.fontawesome.com/9aa665cf7f.js" />
        <script src="https://checkout.stripe.com/checkout.js" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-111535003-1"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-111535003-1');

          var trackOutboundLink = function(url) {
             ga('send', 'event', 'outbound', 'click', url, {
               'transport': 'beacon',
               'hitCallback': function(){document.location = url;}
             });
          }`
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.intercomSettings = {
            app_id: "vvjj64dd"
          };

          (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/vvjj64dd';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()

          `
          }}
        />
      </head>
      <body className="sans-serif black">
        <div className="site-wrapper">
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: props.body }}
          />
          {props.postBodyComponents}
        </div>
      </body>
    </html>
  );
};
