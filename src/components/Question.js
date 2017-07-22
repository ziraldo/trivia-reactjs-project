import React from "react";
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';

class Question extends React.Component {

  renderChoice(guess) {
    return (
      <Choice
        text = {guess}
        onClick = {() => this.props.onClick(guess)}
        key = {guess}
      />
    );
  }

  render() {
    const correct_answer = [(
      this.renderChoice(decodeHtml(this.props.correct_answer))
    )]
    const incorrect_answers = this.props.incorrect_answers.map((answer) =>
      this.renderChoice(decodeHtml(answer))
    )

    let question = decodeHtml(this.props.question)
    const randomizedChoices = shuffleArray(correct_answer.concat(incorrect_answers));
    const title = (
      <h3>{question}</h3>
    );
    return (
      <div>
        <Panel header={title} bsStyle="primary">
          <ListGroup>
            {randomizedChoices}
          </ListGroup>
        </Panel>
      </div>
    );
  }
}

function Choice(props) {
  return (
    <ListGroupItem onClick={props.onClick}>
      {props.text}
    </ListGroupItem>
  )
}

// ==============================================
// Helper functions

function shuffleArray(input_array) {
  let array = input_array.slice()
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default Question