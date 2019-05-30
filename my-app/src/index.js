import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();





/*
ReactJS Tutorial on Tic Tac Toe Project
https://reactjs.org/tutorial/tutorial.html

Additional Resources
CSS Styling Guide https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822
*/


//Stopped at https://reactjs.org/tutorial/tutorial.html#adding-time-travel

function Square(props){
	return(
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			//Stores the current game state
			squares : Array(9).fill(null),
			xIsNext: true,
		};
	}

	//Updates the game state according to mouse clicks
	handleClick(i){
		const squares = this.state.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			//Ignore click once there is a winner
			return;
		}
		//Check which player's turn and fill in square accordingly
		squares[i] = this.state.xIsNext? 'X':'O';
		this.setState({
			squares: squares,
			xIsNext: !this.state.xIsNext,
		});
	}

	renderSquare(i) {
		return (
			<Square 
				//Render the squares according to the game state values
				value={this.state.squares[i]} 
				//Handles behaviour when user clicks square
				onClick={() => this.handleClick(i)}
			/>
		);
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner){
			//Declare winner
			status = 'Winner: ' + winner;
		}
		else {
			status = 'Next Player: ' + (this.state.xIsNext? 'X' : 'O')
		}

		return (
			<div>
				<div className="status">{status}</div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board />
				</div>
				<div className="game-info">
					<div>{/* status */}</div>
					<ol>{/* TODO */}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
