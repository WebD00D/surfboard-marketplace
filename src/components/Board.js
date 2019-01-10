import React, { PureComponent } from 'react';
import '../layouts/css/board.css';
import moment from 'moment';

export default class Board extends PureComponent {
  render() {
    const { onClick, board } = this.props;
    console.log('BOARD', board);

    return (
      <div className="board-list-item" onClick={onClick}>
         <div className="board-location f-13 ls-1  t-sans">
            <i className="fa fa-map-marker" /> {board.city}, {board.region}
          </div>
        <div className="fx fx-col t-sans">
          <div className="f-16 ls-1 board-name" >
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
            {board.description && board.description.substring(0, 150)}...
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
