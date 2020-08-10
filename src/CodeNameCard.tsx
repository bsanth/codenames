import React from "react";
import './CodeNameCard.scss';

type CodeNameCardType = {
    word: string;
    theme?: string;
}

export const CodeNameCard = ({ word, theme = 'neutral' }: CodeNameCardType) => {
    return <div className={`card ${theme}`}>{word}</div>;
};
