import React from "react";
import { Label } from 'react-bootstrap';

import Progress from './Progress'
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
    let currentQuestion;
    if (this.state.stepNumber !== this.state.questions.length) {
      const currentQuestionObj = this.state.questions[this.state.stepNumber];
      currentQuestion = (
        <Question
            question={currentQuestionObj.question}
            correctAnswer={currentQuestionObj.correct_answer}
            incorrectAnswers={currentQuestionObj.incorrect_answers}
            onClick={guess => this.handleClick(guess)}
          />
      );
    }

    return (
      <div className="game">
        <div className="game-board">
          {currentQuestion}
        </div>
        <div className="game-info">
          <div className="progress">
            <Progress
              currentStep={this.state.stepNumber}
              totalSteps={this.state.questions.length}
            />
          </div>
          <div>
            {this.state.guesses}
          </div>
          <div>
            Score: {this.state.score}/{this.state.stepNumber}
          </div>
        </div>
      </div>
    );
  }

  handleClick(guess) {
    const currentQuestion = this.state.questions[this.state.stepNumber];
    const decodedGuess = decodeHtml(guess);
    const decodedCorrectAnswer = decodeHtml(currentQuestion.correct_answer);

    // Check if question was answered correctly
    let currentScore = this.state.score;
    if (decodedGuess === decodedCorrectAnswer) {
      currentScore++;
    }

    let guessStatus = this.getGuessStatus(decodedGuess, decodedCorrectAnswer);

    // Update the state
    this.setState({
      guesses: this.state.guesses.concat(guessStatus),
      stepNumber: this.state.stepNumber + 1,
      score: currentScore
    });
  }

  getGuessStatus(guess, correctAnswer) {
    let answerMsg;
    let msgStyle;
    if (guess === correctAnswer) {
      answerMsg = "Correct: " + correctAnswer;
      msgStyle = "success";
    } else {
      answerMsg = "Wrong, correct answer is: " + correctAnswer;
      msgStyle = "danger";
    }
    return (
      <h3 key={answerMsg}>
        <Label bsStyle={msgStyle}>
          {answerMsg}
        </Label>
      </h3>
    );
  }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default Trivia