import React from "react";
import ReactDOM from "react-dom";
import "./index.css";


function Choice(props) {
  return (
    <button className="choice" onClick={props.onClick}>
      {props.text}
    </button>
  );
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

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
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
      <div className="choice">
        {this.renderChoice(decodeHtml(this.props.correct_answer))}
      </div>
    )]
    const incorrect_answers = this.props.incorrect_answers.map((answer) =>
      <div className="choice">
        {this.renderChoice(decodeHtml(answer))}
      </div>
    )

    let question = decodeHtml(this.props.question)
    const randomizedChoices = shuffleArray(correct_answer.concat(incorrect_answers));
    return (
      <div>
        <div className="question">
          {question}
        </div>
        {randomizedChoices}
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
    const url = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'

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
    if (guess === decodeHtml(currentQuestion.correct_answer)) {
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
    if (this.state.stepNumber >= this.state.questions.length) {
      status = "Survey Complete";
      currentQuestionID = this.state.stepNumber - 1;
    } else {
      status = "Please make a selection";
      currentQuestionID = this.state.stepNumber
    }
    const currentQuestion = this.state.questions[currentQuestionID];


    // Determine if last answer was correct
    let answerStatus;
    if (this.state.stepNumber > 0) {
      if (this.state.guesses[this.state.stepNumber - 1] ===
          this.state.questions[this.state.stepNumber - 1].correct_answer) {
        answerStatus = "Correct";
      } else {
        answerStatus = "Wrong, correct answer is: " + 
          this.state.questions[this.state.stepNumber - 1].correct_answer;
      }
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
