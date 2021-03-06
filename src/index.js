import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  // constructor(props) {
  //   // add constructor to class to initialize state
  //   super(props);
  //   this.state = {
  //     value: null,
  //   };
  // }
// constructor deleted from Square bc square in end will not keep track of game's state instead board will
// Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they’re clicked. In React terms, the Square components are now controlled components. The Board has full control over them.
  
    return (
      <button 
      className="square" 
      onClick={props.onClick}
      // changed onClick={() => this.props.onClick()} to a shorter onClick={props.onClick} (note the lack of parentheses on both sides).
      //onClick prop is built in DOM  <button> component
      //This event handler calls this.props.onClick(). The Square’s onClick prop was specified by the Board.
      // tells React to set up click event listener
      // When you call setState in a component, React automatically updates the child components inside of it too.
      // Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
      >
        {props.value}
      </button>
    );
  }
  // this.props is changed to just props above!

// function components are a simpler way to write components that only contain a render method and don’t have their own state. 
// write function that takes props as input instead of extending React.Component for square

// To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.
// Lifting state into a parent component is common when React components are refactored — let’s take this opportunity to try it out.

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     //board's initial state contains array of 9 nulls corresponding to squares
  //     xIsNext: true,
  //   };
  // }
  // dont need constructor since state lifted to game

  
  renderSquare(i) {
    return (
      <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} 
      // passing down two props to square = value and onClick
      // onClick is fxn that Square can call when clicked
      //pass down a function from the Board to the Square, and we’ll have Square call that function when a square is clicked.
      />
    );
  }

  render() {
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    // }
    // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // remove above line and replace with if/else statement
    return (
      <div>
        {/* <div className="status">{status}</div> */}
        {/* removed above since game component is now rendering game's status */}
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
        squares: Array(9).fill(null)
      }
    ],
      stepNumber: 0,
      // add stepNumber to the Game component’s state to indicate which step we’re currently viewing.
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // We will also replace reading this.state.history with this.state.history.slice(0, this.state.stepNumber + 1). This ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    // we call .slice() to create a copy of the squares array to modify instead of modifying the existing array
    // immutability makes complex features much easier to implement. Later in this tutorial, we will implement a “time travel” feature that allows us to review the tic-tac-toe game’s history and “jump back” to previous moves. This functionality isn’t specific to games — an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game’s history intact, and reuse them later.
    // The main benefit of immutability is that it helps you build pure components in React. Immutable data can easily determine if changes have been made, which helps to determine when a component requires re-rendering.
    // see shouldComponentUpdate() and pure components/optimizing performance
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // handle function returns early by ignoring click if someone wins or if square is already filled
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
        squares: squares
        // Unlike the array push() method you might be more familiar with, the concat() method doesn’t mutate the original array, so we prefer it.

      }
    ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // reflects move displayed to the user now
      // After we make a new move, we need to update stepNumber by adding stepNumber: history.length as part of the this.setState argument. This ensures we don’t get stuck showing the same move after a new one has been made.
      xIsNext: (step % 2) === 0
      // we’ll define the jumpTo method in Game to update that stepNumber. We also set xIsNext to true if the number that we’re changing stepNumber to is even:
    });
  }

  //lift state up again from board to game
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // modify the Game component’s render method from always rendering the last move to rendering the currently selected move according to stepNumber
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? 
      'Go to move #' + move : 
      'Go to game start';
      // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.

      return (
        <li key={move}>
        {/* In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key. */}
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-info-status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
//update Game components render function to use most recent history entry to determine and display game's status


// For each move in the tic-tac-toe game’s history, we create a list item <li> which contains a button <button>. The button has a onClick handler which calls a method called this.jumpTo()
// key is a special and reserved property in React (along with ref, a more advanced feature). When an element is created, React extracts the key property and stores the key directly on the returned element. Even though key may look like it belongs in props, key cannot be referenced using this.props.key. React automatically uses key to decide which components to update. A component cannot inquire about its key.
// Keys do not need to be globally unique; they only need to be unique between components and their siblings.
// dont use indices as keys usually bc there will be problems when reordering
// In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.

// helper function: Given an array of 9 squares, this function will check for a winner and return 'X', 'O', or null as appropriate.
// ========================================
// We’ll want the top-level Game component to display a list of past moves. It will need access to the history to do that, so we will place the history state in the top-level Game component.
// Placing the history state into the Game component lets us remove the squares state from its child Board component. Just like we “lifted state up” from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board’s data, and lets it instruct the Board to render previous turns from the history.
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

