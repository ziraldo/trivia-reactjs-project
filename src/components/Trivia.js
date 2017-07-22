import React from "react";
import { Label } from 'react-bootstrap';

import Question from './Question'

class Trivia extends React.Component {
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
    const url = 'https://opentdb.com/api.php?amount=10'

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

  isTriviaComplete(currentStepNumber, questions) {
    return currentStepNumber === questions.length;
  }

  getAnswerStatus(state) {
    let answerStatus;
    if (state.stepNumber > 0) {
      // Determine if last answer was correct
      const previousGuess = decodeHtml(state.guesses[state.stepNumber - 1]);
      const previousCorrectAnswer = decodeHtml(state.questions[state.stepNumber - 1].correct_answer);
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
        <h3>
          <Label bsStyle={msgStyle}>
            {answerMsg}
          </Label>
        </h3>
      );
    }
    return answerStatus;
  }

  render() {
    // Return empty board if we have no questions
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

    // Determine if the trivia is complete
    let status;
    let currentQuestion;
    if (this.isTriviaComplete(this.state.stepNumber, this.state.questions)) {
      status = "Trivia Complete";
    } else {
      status = "Please make a selection";
      const currentQuestionObj = this.state.questions[this.state.stepNumber];
      currentQuestion = (
        <Question
            question={currentQuestionObj.question}
            correct_answer={currentQuestionObj.correct_answer}
            incorrect_answers={currentQuestionObj.incorrect_answers}
            onClick={guess => this.handleClick(guess)}
          />
      );
    }

    const answerStatus = this.getAnswerStatus(this.state);
    const score = this.state.score;
    const numAnswered = this.state.stepNumber;

    return (
      <div className="game">
        <div>
          {answerStatus}
        </div>
        <div className="game-board">
          {currentQuestion}
        </div>
        <div className="game-info">
          <div>
            {status}
          </div>
          <div>
            Score: {score}/{numAnswered}
          </div>
        </div>
      </div>
    );
  }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default Trivia