import React from "react";
// import { Label } from 'react-bootstrap';
import { Pager } from 'react-bootstrap';

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
        let questions = [];
        data.results.forEach(function(element) {
          questions.push({
            question: element.question,
            correct_answer: element.correct_answer,
            choices: shuffleArray(element.incorrect_answers.concat(element.correct_answer))
          });
        });
        that.setState({ questions: questions });
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
      let currentGuess = this.state.guesses[this.state.stepNumber] || "";
      currentQuestion = (
        <Question
            question={currentQuestionObj.question}
            correctAnswer={currentQuestionObj.correct_answer}
            choices={currentQuestionObj.choices}
            guess={currentGuess}
            onClick={guess => this.handleGuessClick(guess)}
          />
      );
    }

    const prevDisabled = this.state.stepNumber === 0;
    const nextDisabled = (this.state.stepNumber === this.state.questions.length - 1 ||
                          this.state.stepNumber >= this.state.guesses.length);
    console.log(nextDisabled);
    return (
      <div className="game">
        <div className="game-board">
          {currentQuestion}
        </div>
        <div className="game-info">
          <div className="progress">
            <Progress
              currentStep={this.state.guesses.length}
              totalSteps={this.state.questions.length}
            />
          </div>
          <div>
            <Pager>
              <Pager.Item disabled={prevDisabled} previous onClick={() => this.handlePrevClick()}>&larr; Previous</Pager.Item>
            Score: {this.state.score}/{this.state.guesses.length}
              <Pager.Item disabled={nextDisabled} next onClick={() => this.handleNextClick()}>Next &rarr;</Pager.Item>
            </Pager>
          </div>
        </div>
      </div>
    );
  }

  handlePrevClick() {
    this.setState({
      stepNumber: this.state.stepNumber - 1,
    });
  }

  handleNextClick() {
    this.setState({
      stepNumber: this.state.stepNumber + 1,
    });
  }

  handleGuessClick(guess) {
    console.log('handleGuessClick clicked');
    const currentQuestion = this.state.questions[this.state.stepNumber];
    const decodedGuess = decodeHtml(guess);
    const decodedCorrectAnswer = decodeHtml(currentQuestion.correct_answer);

    // Check if question was answered correctly
    let currentScore = this.state.score;
    if (decodedGuess === decodedCorrectAnswer) {
      currentScore++;
    }

    // Update the state
    this.setState({
      guesses: this.state.guesses.concat(decodedGuess),
      score: currentScore
    });
  }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

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

export default Trivia