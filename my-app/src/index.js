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






const numSquares = 9;

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

class PlayerSetting extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			xPlayerName:'Player X',
			oPlayerName:'Player O',
		}
		this.handleChangeX = this.handleChangeX.bind(this);
		this.handleChangeO = this.handleChangeO.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);

	}

	//Update state
	handleChangeX(event){
		this.setState({xPlayerName: event.target.value});
	}

	//Update state
	handleChangeO(event){
		this.setState({oPlayerName: event.target.value});
	}

	//Update game state from props
	handleSubmit(event){

		this.props.onSubmit(this.state.xPlayerName, this.state.oPlayerName);
		event.preventDefault();
	}

	render(){
		return(

			<form onSubmit = {this.handleSubmit}>

				<p>Change Player Name</p>
				<label>
					<span className = "field-label">Name for Player 1 (X)</span> 
					<input type="text" value = {this.state.xPlayerName} onChange = {this.handleChangeX}/>
				</label>
				<br/>
				<label>
					<span className = "field-label">Name for Player 2 (O)</span> 
					<input type="text" value = {this.state.oPlayerName} onChange = {this.handleChangeO}/>
				</label>
				<br/>
				<input className = "change-name-submit" type="submit" value="Update" />

			</form>
		)
	}
}


class PlayMusic extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			play: false
		};
		this.audio = new Audio(this.props.musicURL);
	}

	audio = new Audio(this.props.musicURL)

	togglePlay = () => { //Correct arrow function usage??

		let currentMusic = this.state.play

		this.setState({
			play: !currentMusic,
		});

		if (!currentMusic){
			this.audio.play();
		}
		else {
			this.audio.pause();
		}
	}

	render() {
		return (
			<div>
				<p>Music</p>
				<button onClick = {this.togglePlay}>{this.state.play? "Paused" : "Play"}</button>
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
				squares:Array(numSquares).fill(null),
			}],
			xIsNext: true,

			emptySquaresLeft: numSquares,

			//Track end game status
			stepNumber: 0,
			draw: false,
			gameEnd : false,

			//Track player scores
			xWon:0,
			oWon:0,

			//Default player names
			xPlayerName: "Player X",
			oPlayerName: "Player O",
		}

		this.musicURL = "http://k007.kiwi6.com/hotlink/kw5n9w0zmt/Nashville_Life_Music_-_All_Power.mp3"
		//MP3 src : https://www.youtube.com/watch?v=CRB13OKLE4M
	}

	//Updates the game state according to mouse clicks
	handleClick(i){

		//Get current game state, allow future to be erased once a state in the
		//past has been changed
		const history = this.state.history.slice(0, this.state.stepNumber +1); //Erases the next move onward
		const current = history[history.length-1];
		const squares = current.squares.slice();

		//Handles click on a filled square or game has already ended with a draw/winner
		if (squares[i] || this.state.gameEnd) {
			return
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
			emptySquaresLeft: this.state.emptySquaresLeft - 1,
		});

		//Check for winner after playing current move. Update game state
		let winner = calculateWinner(squares);

		if (winner != null){
			this.setState({
				gameEnd: true,
			});
			this.gameWon(winner);
			return
		}

		//Deal with draw situations
		else {
			if (this.state.emptySquaresLeft === 1){
				this.setState({
					draw : true,
					gameEnd : true,
				})
			}
		}


	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step%2) === 0,
			emptySquaresLeft: numSquares - step,
		});
	}

	//Resets steps, game history, game board
	reMatch(){
		this.setState({
			stepNumber: 0,
			xIsNext: true,
			gameEnd: false,
			draw: false,
			emptySquaresLeft: numSquares,
			history:[{
				squares:Array(numSquares).fill(null),
			}],
		});
	}

	//Record current round winner to game score
	gameWon(player){

		if (player === 'X'){
			this.setState({
				xWon: this.state.xWon + 1,
			});
		}
		else {
			this.setState({
				oWon: this.state.oWon + 1,
			});
		}
	}

	changeNames(x,o){
		this.setState({
			xPlayerName: x,
			oPlayerName: o,
		})
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

		//Compose game info
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		}
		else if (this.state.draw) {
			status = 'Game Draw';
		}
		else {
			status = 'Next Player: ' + (this.state.xIsNext ? 'X':'O');
		}


		return (

			<div className="game">
				<div className="header">
					<p>Tic Tac Toe with React JS</p>
					<p>by Derick Chen</p>
				</div>
				<div className="game-main">
					<div className="game-info">
						<p>Player Scores</p>
						<div>{this.state.xPlayerName} : {this.state.xWon}</div>
						<div>{this.state.oPlayerName} : {this.state.oWon}</div>
						<p>Game Info</p>
						<div>{status}</div>
						{ this.state.gameEnd ? <button onClick={()=> this.reMatch()}>Re-Match</button> : <div>Legal Moves Left: {this.state.emptySquaresLeft}</div>}
					</div>
					<div className="game-board">
						<Board 
							squares = {current.squares}
							onClick = {(i) => this.handleClick(i)}

						/>
					</div>
					<div className="move-history">

						<p>Past Moves</p>
						<ol>{moves}</ol>
					</div>
				</div>
				<PlayerSetting
					onSubmit = {(x,o) => this.changeNames(x,o)}/>
				<br/>
				<PlayMusic
					musicURL = {this.musicURL} />
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
