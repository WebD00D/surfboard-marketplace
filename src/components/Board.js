import React, { Component } from 'react';
import '../layouts/css/board.css';
import moment from 'moment';

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.renderPhoto = this.renderPhoto.bind(this);

    this.state = {};
  }

  renderPhoto() {
    if (!this.props.board.featurePhotoURL)
      return <div className="no-image t-sans">No photo provided :(</div>;

    if (this.props.board.featurePhotoURL.indexOf('blob') > -1)
      return <div className="no-image t-sans">No photo provided :(</div>;


    return (
      <div
        className="board-preview-photo"
        style={{ backgroundImage: `url(${this.props.board.featurePhotoURL})` }}
      />
    );
  }

  render() {
    const { onClick, board } = this.props;

    return (
      <div className="board-list-item" onClick={onClick}>
        <div className="board-location f-13 ls-1  t-sans">
          <i className="fa fa-map-marker" /> {board.city}, {board.region}
        </div>

        <div className="photo-wrap">{this.renderPhoto()}</div>

        <div className="fx fx-col t-sans">
          <div className="f-16 ls-1 board-name">
            {board.name} -{' '}
            {board.sold ? (
              <span className="fc-red">SOLD</span>
            ) : (
              <span className="fc-green">${board.price}</span>
            )}{' '}
          </div>

          <div
            className="f-13 ls-1 t-sans"
            style={{ paddingRight: '22px', fontWeight: '300' }}
          >
            {board.description && board.description.substring(0, 120)}...
            {board.isShopPost ? <div className="shop-tag">#SURFSHOPLISTING</div> :''}
          </div>
        </div>

        
      </div>
    );
  }
}

// id: 1,
// userId: 1,
// region: 'Southern California',
// city: 'San Diego',
// name: `5'8" Rusty Dwart`,
// brand: `Rusty`,
// model: `Dwart`,
// price: '300',
// dimensions: ` 5'8" x 32" x 3" `,
// fins: "3",
// condition: "Good",
// description: "Description lorem ipsum dolar set amit",
// shaperInfo: "Shaper info lorem ipsum dolar set amit.",
// featurePhotoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
// photoOneURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
// photoTwoURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
// photoThreeURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
// photoFourURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
// photoFiveURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
// photoSixURL: 'https://galvu7hf6k-flywheel.netdna-ssl.com/wp-content/uploads/2017/10/image-16.jpg',
