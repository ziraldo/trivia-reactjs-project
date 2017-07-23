import React from "react";
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';

class Question extends React.Component {

  renderChoice(guess, correctAnswer, choice) {
    let style = "";
    if (!choice || (guess !== correctAnswer && guess !== choice)) {
        return (
            <Choice
                text = {guess}
                onClick = {() => this.props.onClick(guess)}
                key = {guess}
            />
        );
    } else if (guess === correctAnswer){
        style = "success";
    } else if (guess === choice) {
        style = "danger";
    }
    return (
        <StyledChoice
            text = {guess}
            onClick = {() => this.props.onClick(guess)}
            key = {guess}
            bsStyle = {style}
        />
    );
  }

  render() {
    const question = decodeHtml(this.props.question)
    const choices = this.props.choices.map((choice) =>
      this.renderChoice(
        decodeHtml(choice),
        decodeHtml(this.props.correctAnswer),
        decodeHtml(this.props.guess)
      )
    )

    const title = (
      <h3>{question}</h3>
    );
    return (
      <div>
        <Panel header={title} bsStyle="primary">
          <ListGroup>
            {choices}
          </ListGroup>
        </Panel>
      </div>
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

// ==============================================
// Helper functions

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default Question