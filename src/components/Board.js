import React, {PureComponent} from 'react';
import "../layouts/css/board.css";


export default class Board extends PureComponent {

  render() {

    const {onClick, board} = this.props;
    console.log("BOARD", board)

    return (

      <div className="board-list-item" onClick={onClick}>
        <div className="fx fx-col t-sans">
            <b className="f-16 ls-1">{board.name} - { board.sold ? <span className="fc-red">SOLD</span>: <span className="fc-green">${board.price}</span> }  </b>
            <div className="f-13 ls-1 o-5 t-sans"><i className="fa fa-expand"></i> {board.dimensions}</div>
            <div className="f-13 ls-1 o-5 t-sans"><i className="fa fa-map-marker"></i> {board.city}, { board.region}</div>
            <div className="f-13 ls-1 t-sans" style={{marginTop: '6px', paddingRight: '22px'}}>
             { board.description && board.description.substring(0,100) }...
            </div>
        </div>
          <img className="board-list-item__image" src={board.featurePhotoURL} />
      </div>


        // <div className="board" onClick={onClick}>
        //     <div className="board__image" style={{backgroundImage: `url(${board.featurePhotoURL})` }}></div>
        //     <div className="board__meta"><label>{board.fins} Fin</label>|<label>{board.dimensions}</label></div>
        //     <div className="board__name">{board.name}</div>
        //     { board.sold ? <div className="board__price fc-red">SOLD</div> : <div className="board__price">${board.price} </div> }
        //
        // </div>
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
