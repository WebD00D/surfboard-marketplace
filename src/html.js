import React from 'react';
import Helmet from 'react-helmet';

let stylesStr;
if (process.env.NODE_ENV === 'production') {
  try {
    stylesStr = require('!raw-loader!../public/styles.css');
  } catch (e) {
    console.log(e);
  }
}

module.exports = props => {
  let css;
  if (process.env.NODE_ENV === 'production') {
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
          href="https://fonts.googleapis.com/css?family=Roboto:300,400"
          rel="stylesheet"
        />

        <script src="https://use.fontawesome.com/9aa665cf7f.js" />
        <script src="https://checkout.stripe.com/checkout.js" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-118033416-1"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-118033416-1');

          var trackOutboundLink = function(url) {
             ga('send', 'event', 'outbound', 'click', url, {
               'transport': 'beacon',
               'hitCallback': function(){document.location = url;}
             });
          }`
          }}
        />

        <script src="https://wchat.freshchat.com/js/widget.js" />
      </head>
      <body className="sans-serif black">
        <div className="site-wrapper">
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: props.body }}
          />
          {props.postBodyComponents}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.fcWidget.init({
              token: "1a4188ec-1fac-49e3-8400-f00738943021",
              host: "https://wchat.freshchat.com"
            });
            `
          }}
        />
      </body>
    </html>
  );
};
