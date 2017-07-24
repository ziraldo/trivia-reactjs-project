import React from "react";
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';

class Question extends React.Component {

    render() {
        const question = this.props.question;
        const choices = this.props.choices.map((choice) =>
            this.renderChoice(
                choice,
                this.props.correctAnswer,
                this.props.guess
            )
        )

        return (
            <div className="question">
                <Panel header={(<h3>{question}</h3>)} bsStyle="primary">
                <ListGroup>
                    {choices}
                </ListGroup>
                </Panel>
            </div>
        );
    }

    renderChoice(guess, correctAnswer, choice) {
        const onClick = (choice) ? null : () => this.props.onClick(guess);

        // No style if no choice has been made or
        // the choice was correct or incorrect
        if (!choice || (guess !== correctAnswer && guess !== choice)) {
            return (
                <Choice
                    text = {guess}
                    onClick = {onClick}
                    key = {guess}
                />
            );
        }

        // We either want to style the correct answer or an incorrect choice
        const style = (guess === correctAnswer) ? "success" : "danger";
        return (
            <StyledChoice
                text = {guess}
                onClick = {onClick}
                key = {guess}
                bsStyle = {style}
            />
        );
    }
}

function Choice(props) {
    return (
        <ListGroupItem
            onClick={props.onClick}
        >
            {props.text}
        </ListGroupItem>
    );
}

function StyledChoice(props) {
    return (
        <ListGroupItem
            onClick={props.onClick}
            bsStyle={props.bsStyle}
        >
            {props.text}
        </ListGroupItem>
    );
}

export default Question