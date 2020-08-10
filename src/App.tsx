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
}

class App extends Component<any, stateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            isSpymaster: false,
            wordIndices: [],
            redWordIndices: [],
            blueWordIndices: [],
            skullWordIndex: []
        };
    }

    getUniqueValues(numOfUniqueValues: number, availableRange: number): number[] {
        const indices: number[] = [];
        while(indices.length < numOfUniqueValues){
            let r = Math.floor(Math.random() * availableRange) + 1;
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
        return this.getUniqueValues(25, 400);
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
        this.setState({
            wordIndices,
            redWordIndices,
            blueWordIndices,
            skullWordIndex,
        });
        const encryptedString = this.encrypt(wordIndices, redWordIndices, blueWordIndices, skullWordIndex);
        console.log(encryptedString);
        console.log(window.atob(encryptedString));
    }

    render() {
        return (
            <div className="App">
                <h1>Codenames</h1>
                <div>
                    <button onClick={() => this.generateNewBoard()}>Generate new board</button><br /><br /><hr /><br />
                    {
                        this.state.wordIndices.length === 25 && <button onClick={() => this.toggleSpymaster()}>
                            Toggle spymaster
                        </button>
                    }
                    <br /><br />
                </div>
                <div className="grid-container">
                {
                    this.state.wordIndices.length === 25 && [...Array(25)].map((_,i) => {
                        const word = words[this.state.wordIndices[i]];
                        if (!this.state.isSpymaster) {
                            return <CodeNameCard key={word} word={word} />;
                        }

                        if (this.state.redWordIndices.includes(i)) {
                            return <CodeNameCard key={word} theme="red" word={word} />;
                        } else if (this.state.blueWordIndices.includes(i)) {
                            return <CodeNameCard key={word} theme="blue" word={word} />;
                        } else if (this.state.skullWordIndex.includes(i)) {
                            return <CodeNameCard key={word} theme="skull" word={word} />;
                        } else {
                            return <CodeNameCard key={word} word={word} />;
                        }
                    })
                }
                </div>
            </div>
        );
    }
}


export { App };