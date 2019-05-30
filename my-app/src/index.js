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
ReactJS Tutorial on Tic Tac Toe Project [Completed]
https://reactjs.org/tutorial/tutorial.html

Additional Resources
CSS Styling Guide https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822
*/


function Square(props){
	return(
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {

	renderSquare(i) {
		return (
			<Square 
				//Render the squares according to the game state values
				value={this.props.squares[i]} 
				//Handles behaviour when user clicks square
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {

		return (
			<div>
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

	constructor(props){
		super(props);
		this.state={
			//Track game historical states with immutable state arrays at
			//every move
			history:[{
				squares:Array(9).fill(null),
			}],
			xIsNext: true,
			stepNumber: 0,
		}
	}

	//Updates the game state according to mouse clicks
	handleClick(i){

		//Get current game state, allow future to be erased once a state in the
		//past has been changed
		const history = this.state.history.slice(0, this.state.stepNumber +1); //Erases the next move onward
		const current = history[history.length-1];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) {
			//Ignore click once there is a winner
			return;
		}
		//Check which player's turn and fill in square accordingly
		squares[i] = this.state.xIsNext ? 'X':'O';
		//Record to history, switch turn
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step%2) === 0,
		});
	}


	render() {
		//Get current gate state and check for winner
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		//Time travel and make changes to game state
		const moves = history.map((step,move) => {
			const desc = move?
				'Go to move #' + move : 
				'Go to game start';
			return (
				//Store key data to identify dynamic list
				<li key={move}>
					<button onClick = {() => this.jumpTo(move)}>{desc}</button>
				</li>
			);


		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		}
		else {
			status = 'Next Player: ' + (this.state.xIsNext ? 'X':'O');
		}


		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares = {current.squares}
						onClick = {(i) => this.handleClick(i)}

					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
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
