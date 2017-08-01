import React from "react";

import { Button } from 'react-bootstrap';
import { Pager } from 'react-bootstrap';

import Progress from './Progress'
import Question from './Question'

class Quiz extends React.Component {
    constructor() {
        super();

        this.state = {
            guesses: [],
            questions: [],
            score: 0,
            currentQuestionID: 0
        };
    }

    componentWillMount() {
        this.generateNewQuiz();
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
        const currentQuestionObj = this.state.questions[this.state.currentQuestionID];
        const currentGuess = this.state.guesses[this.state.currentQuestionID] || "";
        const currentQuestion = (
            <Question
                question={currentQuestionObj.question}
                correctAnswer={currentQuestionObj.correct_answer}
                choices={currentQuestionObj.choices}
                guess={currentGuess}
                onClick={guess => this.handleGuessClick(guess)}
            />
        );

        const prevDisabled = this.state.currentQuestionID === 0;
        const nextDisabled = (this.state.currentQuestionID === this.state.questions.length - 1 ||
                              this.state.currentQuestionID >= this.state.guesses.length);

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
                </div>
                <div className="navigation">
                    <Pager>
                        <Pager.Item disabled={prevDisabled} previous onClick={() => this.handlePrevClick()}>&larr; Previous</Pager.Item>
                        Score: {this.state.score}/{this.state.guesses.length}
                        <Pager.Item disabled={nextDisabled} next onClick={() => this.handleNextClick()}>Next &rarr;</Pager.Item>
                    </Pager>
                </div>
                <div>
                    <Button onClick={() => this.generateNewQuiz()}>New Quiz</Button>
                </div>
            </div>
        );
    }

    handlePrevClick() {
        this.setState({
            currentQuestionID: this.state.currentQuestionID - 1,
        });
    }

    handleNextClick() {
        this.setState({
            currentQuestionID: this.state.currentQuestionID + 1,
        });
    }

    handleGuessClick(guess) {
        const currentQuestion = this.state.questions[this.state.currentQuestionID];

        // Check if question was answered correctly
        let currentScore = this.state.score;
        if (guess === currentQuestion.correct_answer) {
            currentScore++;
            this.props.updateStats(true);
        } else {
            this.props.updateStats(false);
        }


        // Update the state
        this.setState({
            guesses: this.state.guesses.concat(guess),
            score: currentScore
        });
    }
    
    generateNewQuiz() {
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
                    let choices = element.incorrect_answers.map((answer) => decodeHtml(answer));
                    questions.push({
                        question: decodeHtml(element.question),
                        correct_answer: decodeHtml(element.correct_answer),
                        choices: shuffleArray(choices.concat(decodeHtml(element.correct_answer)))
                    });
                });
                that.setState({ questions: questions });
            })
            .then(function() {
                that.setState({
                    guesses: [],
                    score: 0,
                    currentQuestionID: 0
                })
            });
    }
}

// ==============================================
// Helper functions

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

export default Quiz