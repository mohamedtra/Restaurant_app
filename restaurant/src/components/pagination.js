import React, {Component} from 'react';

export default class Pagination extends Component {

    handleButtonClick = element => {
        const target = element.target;
        const currentPage = parseInt(target.innerHTML, 10) - 1;

        this.props.onButtonClick(currentPage);

        if (target.id === 'thirdButton' || target.id === 'firstButton') {
            if (currentPage === 0 || currentPage === this.props.lastPage) {
                console.log('exit')
                return;
            }
            console.log('changing')
            document.querySelector('#firstButton').innerHTML = currentPage;
            document.querySelector('#secondButton').innerHTML = currentPage + 1;
            document.querySelector('#thirdButton').innerHTML = currentPage + 2;
        }
    }

    render() {
        return (
            <div className="navigation">
                <button type="button" className="btn btn-dark" id="firstButton" onClick={this.handleButtonClick}>1
                </button>
                <button type="button" className="btn btn-dark" id="secondButton" onClick={this.handleButtonClick}>2
                </button>
                <button type="button" className="btn btn-dark" id="thirdButton" onClick={this.handleButtonClick}>3
                </button>
                ......................
                <button type="button" className="btn btn-dark" id="lastPageButton"
                        onClick={this.handleButtonClick}> {this.props.lastPage} </button>
            </div>);
    }
}
