import React from "react";
import ReactDOM from "react-dom";

import { Button } from 'react-bootstrap';
import { Label } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';

import "./index.css";


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

function Choice(props) {
  return (
    <Button onClick={props.onClick} bsSize="large" block>
      {props.text}
    </Button>
  )
}

class Question extends React.Component {
  renderChoice(guess) {
    return (
      <Choice
        text = {guess}
        onClick = {() => this.props.onClick(guess)}
      />
    );
  }

  render() {
    const correct_answer = [(
      <div className="choice" key={this.props.correct_answer} >
        {this.renderChoice(decodeHtml(this.props.correct_answer))}
      </div>
    )]
    const incorrect_answers = this.props.incorrect_answers.map((answer) =>
      <div className="choice" key={answer}>
        {this.renderChoice(decodeHtml(answer))}
      </div>
    )

    let question = decodeHtml(this.props.question)
    const randomizedChoices = shuffleArray(correct_answer.concat(incorrect_answers));
    const title = (
      <h3>{question}</h3>
    );
    return (
      <div>
        <Panel header={title} bsStyle="primary">
          {randomizedChoices}
        </Panel>
      </div>
    );
  }
}

class Survey extends React.Component {
  constructor() {
    super();

    this.state = {
      guesses: [],
      questions: [],
      stepNumber: 0,
      score: 0
    };
  }

  componentWillMount() {
    var that = this;
    const url = 'https://opentdb.com/api.php?amount=10&type=multiple'

    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Could not fetch questions");
        }
        return response.json();
      })
      .then(function(data) {
        that.setState({ questions: data.results });
      });
  }

  handleClick(guess) {
    const currentQuestion = this.state.questions[this.state.stepNumber];

    // Check if we've completed all questions
    if (this.state.stepNumber === this.state.questions.length) {
      return;
    }

    // Check if question was answered correctly
    let currentScore = this.state.score;
    if (decodeHtml(guess) === decodeHtml(currentQuestion.correct_answer)) {
      currentScore++;
    }

    // Update the state
    this.setState({
      guesses: this.state.guesses.concat(guess),
      stepNumber: this.state.stepNumber + 1,
      score: currentScore
    });
  }

  render() {
    if (this.state.questions.length <= 0) {
      return (
        <div className="game">
          <div className="game-board">
          </div>
          <div className="game-info">
          </div>
        </div>
      );
    }

    // Determine if the survey is complete
    let status;
    let currentQuestionID;
    if (this.state.stepNumber === this.state.questions.length) {
      status = "Trivia Complete";
      currentQuestionID = this.state.stepNumber - 1;
    } else {
      status = "Please make a selection";
      currentQuestionID = this.state.stepNumber
    }
    const currentQuestion = this.state.questions[currentQuestionID];

    // Determine if last answer was correct
    let answerStatus;
    if (this.state.stepNumber > 0) {
      const previousGuess = decodeHtml(this.state.guesses[this.state.stepNumber - 1]);
      const previousCorrectAnswer = decodeHtml(this.state.questions[this.state.stepNumber - 1].correct_answer);
      let answerMsg;
      let msgStyle;
      if (previousGuess === previousCorrectAnswer) {
        answerMsg = "Correct: " + previousCorrectAnswer;
        msgStyle = "success";
      } else {
        answerMsg = "Wrong, correct answer is: " + previousCorrectAnswer;
        msgStyle = "danger";
      }
      answerStatus = (
          <Label bsStyle={msgStyle}>
            {answerMsg}
          </Label>
        );
    }

    const score = this.state.score;
    const numAnswered = this.state.stepNumber;

    return (
      <div className="game">
        <div className="game-board">
          <Question 
            question={currentQuestion.question}
            correct_answer={currentQuestion.correct_answer}
            incorrect_answers={currentQuestion.incorrect_answers}
            onClick={guess => this.handleClick(guess)} 
          />
        </div>
        <div className="game-info">
          <div>
            {status}
          </div>
          <div>
            {answerStatus}
          </div>
          <div>
            Score: {score}/{numAnswered}
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Survey />, document.getElementById("root"));
