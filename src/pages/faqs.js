import React from "react";
import "../layouts/css/site.css";
import Faq from "../components/faq";

const Faqs = () => (
  <div>
    <div className="page-header">
      <b className="t-sans">FAQs</b>
    </div>
    <div className="site-container">
      <h3 className="t-primary">Boardgrab</h3>
      <div>
        <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
          Buying and selling used surfboards has always kind of sucked. Paying
          massive commissions to a third party , or dealing with the
          inconvenient/shady nuances of Craigslist doesn’t exactly give surfers
          many options. 'Until now. Boardgrab is making selling used surfboards
          suck less. Sell for free, sell conveniently, and become part of a
          community of sellers just like you. Our hope, sellers will work
          together, share knowledge, and experience to make board selling better
          for everyone.
        </p>
      </div>

      <h3 className="t-primary">Buyer</h3>

      <Faq
        headline="How do I purchase an item?"
        copy="When you see something you like, make an offer on the item (you will
      have to sign-up or log-in to the site). When the seller accepts or
      your offer you will be notified via both email and through
      Boardgrab messages. You will be sent a link to check out using Stripe.
      The seller might have accepted multiple offers so act fast. After
      sending your payment through Stripe you will be directed back to
      Boardgrab."
      />

      <Faq
        headline="This listing looks suspicious, what should I do?"
        copy="If you have reason to believe that a seller or item is fraudulent flick
          us an email to help@boardgrab.com and let us know."
      />

      <Faq
        headline="I bought an item, but the seller is not responding."
        copy="If it’s been less than a week, contact the seller again and give him
          another day or two to respond. If the seller does not respond, reach out to us and we'll investigate further."
      />

      <Faq
        headline="I received an item I purchased and it did not come as described, how
          do I get a refund?"
        copy="If you buy something on Boardgrab and the description does not
        accurately describe the item in terms of authenticity, color,
        condition, etc., then we recommend reaching out to the seller for a
        mutually satisfactory resolution. If you are unable to work it out
        with the seller, we can assist you in reaching out to them."
      />


      <Faq
        headline="What if there is an issue with the transaction? (Seller does not ship
          the item, the item is damaged, etc.)"
        copy="All payments on Boardgrab are done safely through Stripe.  If there is any issue with
        the transaction, the buyer and seller should try to work out a mutual
        agreement for a partial or full refund."
       />



      <h3 className="t-primary">Seller</h3>


      <Faq
        headline="How do I sell an item?"
        copy="Create an account and click the 'Start Selling' link in the header.
        Follow the instructions to connect your Boardgrab account to a Stripe
        Account, then upload photos and fill in information about the item
        you’re selling. Your board will then be listed on the shop page. We
        will notify you via both via Boardgrab messages and email when people
        ask questions or submit offers."
       />

       <Faq
        headline="How do I get paid?"
        copy="We use Stripe to process payments, a new and improved payment system
        which is safer and easier to use. Payments occur once a week so you
        will see your funds in your Boardgrab stripe account no longer than 7 days
        after you have been paid."
       />

       <Faq
       headline="I just sold an item on Boardgrab, what’s next?"
       copy="When you make a sale, the funds will be put into your Stripe account
         and a message will be sent to your Boardgrab inbox with the buyer’s
         shipping address. You will then receive an email from
         team@boardgrab.com and stripe.com with transaction details. Once
         you’ve confirmed the payment in your Stripe account, please ship or
         make pickup arrangements with your buyer."
       />

       <Faq
        headline="Where do the funds go when I sell an item?"
        copy="The funds will be put into your Stripe account as soon as a buyer
        purchases an item. The funds will appear immediately in you Boardgrab
        Stripe account. Funds will be sent to your linked bank account/credit
        or debit card in no more than 7 days."
       />

       <Faq
        headline="How many offers can I accept as a seller?"
        copy="You can accept as many offers as you’d like. Whoever pays first buys
        the item."
       />

       <Faq
        headline="I accidentally sent out an offer, how do I cancel it?"
        copy="Simply send another offer with your intended price. Each new offer you
          send overrides the previous offer."
       />

       <Faq
        headline="I accepted an offer on an item I have for sale, when do I get paid?"
        copy="Although you accepted an offer, the deal is not final until the buyer
        purchases the item. You can accept as many offers as you like and
        accepting more offers maximizes the chances of a sale."
       />

       <Faq
        headline="How much does it cost?"
        copy="For a buyer, it doesn’t cost anything other than the price of the board. For a seller it costs a small
        6% Boardgrab fee to help us pay our bills."
       />



      <h3 className="t-primary">Marketplace Code of Conduct</h3>

      <div>
        <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
          <ol>
            <li>
              Be respectful when dealing with other users. Bad behavior will not
              be tolerated.
            </li>
            <li>Follow rule #1.</li>
            <li>
              Do not send frivolous offers. We understand that you cannot always
              follow through, but you should make a good faith effort to do so
              on each and every offer you make.
            </li>
            <li>
              Ship items you sell in a timely manner, ideally within 72 hours
              and no longer than 5 days after purchase.
            </li>
            <li>
              Be honest and accurate in your item descriptions. Make sure to
              highlight any flaws or distinctive details.
            </li>
            <li>
              Communicate well. Keep buyers updated on the status of their
              orders and send tracking whenever possible.
            </li>
            <li>
              Do not advertise your items in any of the comment sections
              (listings or editorial articles). These sections are designated
              for discussion and any solicitations will be removed.
            </li>
          </ol>
        </p>
      </div>

      <div>
        <b className="t-primary">Offsite Transactions</b>
        <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
          A common tactic used by scammers is to offer a discount on the asking
          price to entice users to go outside Boardgrab. Users who attempt to
          conduct transactions offsite are almost always fraudulent. Offsite
          transactions are not eligible for Boardgrab Protection and may not be
          eligible for Stripe protection either. For your safety we actively
          warn and ban users who attempt to conduct unsafe, offsite
          transactions.
        </p>
      </div>

      <div>
        <b className="t-primary">Zero-Tolerance Fraud Policy</b>
        <p className="t-primary" style={{ fontWeight: 400, fontSize: 14 }}>
          We take fraud very seriously. In order to keep the community safe for
          all Boardgrab useres, the Boardgrab team constantly monitors the
          marketplace for fraudulent items and dishonest buyers/sellers. Our
          Zero-Tolerance Policy means that anyone posting counterfeit goods,
          posting items they do not own, or engaging in any other duplicitous
          behavior will be immediately banned from Boardgrab. Please exercise
          good judgement when using the marketplace.
        </p>
      </div>
    </div>
  </div>
);

export default Faqs;
