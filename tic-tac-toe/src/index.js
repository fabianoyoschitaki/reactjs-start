import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery';
import './index.css'

/* class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
} */

// ========================================

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
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

/** class SusepsAssociadas extends React.Component {
    getInitialState() {
        return { text: '' };    
    }
    
    componentDidMount() {
        setInterval(this.callService.bind(this), 5000);
    }

    callService() {
        $.post("http://localhost:8080/acessoadadosWeb/NovoCOLService",
            function (data) {
                this.setState({ text: data });
            }.bind(this));
    }

    render() {
        return <div>Response - {this.state.text}</div>;
    }  
} **/

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)) {
            console.log("We already have a winner.");
            return;
        } else if (squares[i]) {
            console.log("It's already clicked. Choose other.");
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        console.log(i + ' was clicked. Array is: ' + squares);
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        console.log("jumped to :" + step);
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
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
                        onClick={(i) => this.handleClick(i)}
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

class SusepAssociada extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    
    loadSusepData() {
        $.get("http://172.19.14.187:8080/susepsassociadas",
            function (retorno) {
                console.log("Chamou serviço suseps. Tamanho retorno: " + retorno["susepAssociada"].length);
                this.setState({ data: retorno["susepAssociada"] });
            }.bind(this));
    }

    componentDidMount() {
        this.loadSusepData();
    }

    render() {
        return (
            <div>
                <SusepList data={this.state.data} />
            </div>)
    }
}

class SusepList extends React.Component {
    render() {
        console.log("SusepList:" + this.props.data.length);
        return (
            <select className="SusepList">
                {
                    this.props.data.map(function (susep) {
                        return <option key={susep.codigoSusep}>{susep.codigoSusep}</option>
                    })
                }
            </select>
        )
    }
}

// ========================================
ReactDOM.render(
    <Game />, document.getElementById('game')
);

ReactDOM.render(
    <SusepAssociada />, document.getElementById('suseps')
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