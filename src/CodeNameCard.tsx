import React from "react";
import './CodeNameCard.scss';

type CodeNameCardType = {
    word: string;
    theme?: string;
    index: number;
    clickHandler: (arg: number) => void;
}

export const CodeNameCard = ({ word, index, clickHandler, theme = 'neutral' }: CodeNameCardType) => {
    return <div className={`card ${theme}`} onClick={() => clickHandler(index)}>{word}</div>;
};
