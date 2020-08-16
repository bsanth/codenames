import React, {Component} from 'react';
import './App.scss';
import {words} from "./words";
import {CodeNameCard} from "./CodeNameCard";

type stateType =  {
    isSpymaster: boolean;
    wordIndices: number[];
    redWordIndices: number[];
    blueWordIndices: number[];
    skullWordIndex: number[];
    selectedWordIndices: number[];
    blueWordsLeft: number;
    redWordsLeft: number;
    isGameOver: boolean;
    currentTurn: string
}

class App extends Component<any, stateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            isSpymaster: false,
            wordIndices: [],
            redWordIndices: [],
            blueWordIndices: [],
            skullWordIndex: [],
            selectedWordIndices: [],
            blueWordsLeft: 0,
            redWordsLeft: 0,
            isGameOver: false,
            currentTurn: 'Red'
        };
    }

    componentDidMount() {
        console.log(window.location.hash);
        let encryptedBoardData = window.location.hash;
        if (encryptedBoardData != null && encryptedBoardData.length > 2) {
            encryptedBoardData = window.atob(encryptedBoardData.substr(1));
        }
        const splitEncryptedBoardData = encryptedBoardData.split('x');

        const wordIndices = splitEncryptedBoardData.splice(0, 25).map(x => parseInt(x));
        const redWordIndices = splitEncryptedBoardData.splice(0, 9).map(x => parseInt(x));
        const blueWordIndices = splitEncryptedBoardData.splice(0, 8).map(x => parseInt(x));
        const skullWordIndex = splitEncryptedBoardData.splice(0, 1).map(x => parseInt(x));
        this.setState({
            wordIndices,
            redWordIndices,
            blueWordIndices,
            skullWordIndex,
        });
    }

    getUniqueValues(numOfUniqueValues: number, availableRange: number): number[] {
        const indices: number[] = [];
        while(indices.length < numOfUniqueValues){
            let r = Math.floor(Math.random() * availableRange);
            if(indices.indexOf(r) === -1) {
                indices.push(r);
            }
        }
        return indices;
    }

    shuffle25(): number[] {
        return this.getUniqueValues(25, 25);
    }

    make9RedWords(indices: number[]): number[] {
        return indices.splice(0, 9);
    }

    make8BlueWords(indices: number[]): number[] {
        return indices.splice(0, 8);
    }

    makeSkullWord(indices: number[]): number[] {
        return indices.splice(0, 1);
    }

    get25Words() {
        return this.getUniqueValues(25, 399);
    }

    toggleSpymaster() {
        this.setState({
           isSpymaster: !this.state.isSpymaster
        });
    }

    encrypt(wordIndices: number[], redWordIndices: number[], blueWordIndices: number[], skullWordIndex: number[]) {
        const allTogether = [...wordIndices, ...redWordIndices, ...blueWordIndices, ...skullWordIndex];
        const stringToEncrypt = allTogether.join('x');
        return window.btoa(stringToEncrypt);
    }

    generateNewBoard() {
        const wordIndices = this.get25Words();
        const shuffled25 = this.shuffle25();
        const redWordIndices = this.make9RedWords(shuffled25)
        const blueWordIndices = this.make8BlueWords(shuffled25);
        const skullWordIndex = this.makeSkullWord(shuffled25);

        const encryptedString = this.encrypt(wordIndices, redWordIndices, blueWordIndices, skullWordIndex);
        window.location.assign(`#${encryptedString}`);
        window.location.reload();
    }

    isIntersect(arrays: number[][]): number {
        if (0 === arrays.length) {
            return 0;
        }
        return arrays.reduce((intersection, array) => {
            return intersection.filter(intersectedItem => array.some(item => intersectedItem === item));
        }, arrays[0]).length;
    }

    finishGame() {
        this.setState({
            isSpymaster: true,
            isGameOver: true
        })
    }

    getRemainingRedWords(selectedWordIndices?: number[]) {
        if (!selectedWordIndices) {
            selectedWordIndices = this.state.selectedWordIndices;
        }
        return 9 - this.isIntersect([selectedWordIndices, this.state.redWordIndices]);
    }
    getRemainingBlueWords(selectedWordIndices?: number[]) {
        if (!selectedWordIndices) {
            selectedWordIndices = this.state.selectedWordIndices;
        }
        return 8 - this.isIntersect([selectedWordIndices, this.state.blueWordIndices]);
    }

    onCardClick = (selectedIndex: number) => {
        if (this.state.selectedWordIndices.includes(selectedIndex)) {
            return;
        }

        let tempSelected = this.state.selectedWordIndices.concat(selectedIndex);

        if (this.state.skullWordIndex.includes(selectedIndex)
            || this.getRemainingBlueWords(tempSelected) === 0
            || this.getRemainingRedWords(tempSelected) === 0) {
            this.finishGame();
        }

        if (this.state.currentTurn === 'Red' && !this.state.redWordIndices.includes(selectedIndex)) {
            this.toggleTurn();
        }

        if (this.state.currentTurn === 'Blue' && !this.state.blueWordIndices.includes(selectedIndex)) {
            this.toggleTurn();
        }

        this.setState({
            selectedWordIndices: tempSelected
        });
    }

    toggleTurn() {
        let currentTurn = 'Red';
        if (this.state.currentTurn === 'Red') {
            currentTurn = 'Blue'
        }
        this.setState({
            currentTurn
        })
    }

    render() {
        return (
            <div className="App">
                <h1>Codenames</h1>
                <div>
                    <button onClick={() => this.generateNewBoard()}>Generate new board</button>
                </div>
                {
                    this.state.wordIndices.length === 25 && <div className="game-container">
                        <div>
                            Copy URL to share this game: <a href={window.location.href}>shareable link</a>
                        </div>
                        <div className="actions-container">
                            <div className="left">
                                <span className='blue-count'>
                                    {this.getRemainingBlueWords()}
                                </span>
                                &nbsp;-&nbsp;
                                <span className='red-count'>
                                    {this.getRemainingRedWords()}
                                </span>
                            </div>
                            <div className='center'>
                                {this.state.isGameOver && <span>Game over!</span>}
                                {!this.state.isGameOver && <span>{this.state.currentTurn}'s turn</span>}
                            </div>
                            <div>
                                <button className='spymaster-button' onClick={() => this.toggleSpymaster()}>
                                    Toggle spymaster
                                </button>
                                <button onClick={() => this.toggleTurn()}>
                                    End turn
                                </button>
                            </div>
                        </div>
                        <div className="grid-container">
                        {
                            [...Array(25)].map((_,i) => {
                                const word = words[this.state.wordIndices[i]];

                                let theme: string|undefined;
                                if (this.state.isSpymaster || this.state.selectedWordIndices.includes(i)) {
                                    if (this.state.redWordIndices.includes(i)) {
                                        theme = 'red';
                                    } else if (this.state.blueWordIndices.includes(i)) {
                                        theme = 'blue';
                                    } else if (this.state.skullWordIndex.includes(i)) {
                                        theme = 'skull';
                                    }
                                }

                                if (this.state.selectedWordIndices.includes(i)) {
                                    theme += ' selected'
                                }
                                return <CodeNameCard key={word} word={word} theme={theme} index={i} clickHandler={this.onCardClick}/>;
                            })
                        }
                        </div>
                        <div className='footer'>
                            <div className='muted'>Heavily inspired from <a href="https://horsepaste.com" >horsepaste</a>&nbsp;🙏</div>
                            <a href="https://www.buymeacoffee.com/santhosh">Buy the developer a coffee</a>
                        </div>
                    </div>
                }
            </div>
        );
    }
}


export { App };