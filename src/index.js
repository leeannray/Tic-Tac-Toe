import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  // constructor(props) {
  //   // add constructor to class to initialize state
  //   super(props);
  //   this.state = {
  //     value: null,
  //   };
  // }
// constructor deleted from Square bc square in end will not keep track of game's state instead board will
// Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they’re clicked. In React terms, the Square components are now controlled components. The Board has full control over them.
  render() {
    return (
      <button 
      className="square" 
      onClick={() => this.props.onClick()}
      //onClick prop is built in DOM  <button> component
      //This event handler calls this.props.onClick(). The Square’s onClick prop was specified by the Board.
      // tells React to set up click event listener
      // When you call setState in a component, React automatically updates the child components inside of it too.
      // Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
      >
        {this.props.value}
      </button>
    );
  }
}

// To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.
// Lifting state into a parent component is common when React components are refactored — let’s take this opportunity to try it out.

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      //board's initial state contains array of 9 nulls corresponding to squares
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    // we call .slice() to create a copy of the squares array to modify instead of modifying the existing array
    // immutability makes complex features much easier to implement. Later in this tutorial, we will implement a “time travel” feature that allows us to review the tic-tac-toe game’s history and “jump back” to previous moves. This functionality isn’t specific to games — an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game’s history intact, and reuse them later.

    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square 
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)} 
      // passing down two props to square = value and onClick
      // onClick is fxn that Square can call when clicked
      //pass down a function from the Board to the Square, and we’ll have Square call that function when a square is clicked.
      />
    );
  }

  render() {
    const status = 'Next player: X';

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

