import React, {PureComponent} from 'react';
import "../layouts/css/board.css";


export default class BoardFlyOut extends PureComponent {

  render() {

    const {board, onClose} = this.props; 
    console.log("BOARD", board)

    return (
        <div className="board-fly-out__container">
            <div className="board-fly-out__header">
                <i onClick={onClose} className="arrow fa fa-arrow-right"></i>
                <div className="board-fly-out__title">{board.name}</div> 
            </div>

            <div className="board-photos">
                <div className="board-photo" style={{backgroundImage: `url(${board.featurePhotoURL})`}}></div>               
            </div>

            <div className="board-feature-list">
                    <div className="board-feature">
                        <div className="board-feature-title">Board Location</div>
                        <div>{board.city}</div>
                    </div>
                    <div className="board-feature">
                        <div className="board-feature-title">Dimensions</div>
                        <div>{board.dimensions}</div>
                    </div>
                    <div className="board-feature">
                        <div className="board-feature-title">Fin Setup</div>
                        <div>{board.fins}</div>
                    </div>
                    <div className="board-feature">
                        <div className="board-feature-title">Shaper / Brand</div>
                        <div>{board.brand}</div>
                    </div>
                    <div className="board-feature">
                        <div className="board-feature-title">Model</div>
                        <div>{board.model}</div>
                    </div>
                </div>
        </div>
    );
  }
}

