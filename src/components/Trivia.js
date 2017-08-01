import React from "react";
import cookie from "react-cookies";

import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';

import Quiz from './Quiz'

class Trivia extends React.Component {
    constructor() {
        super();

        this.state = {
            stats: {
                totalQuestions: parseInt(cookie.load('totalQuestions'), 10) || 0,
                totalCorrectAnswers: parseInt(cookie.load('correctAnswers'), 10) || 0
            }
        };
    }

    render() {
        var nav = this.renderNav();
        return (
            <div>
                {nav}
                <Quiz
                    updateStats={wasCorrect => this.updateStats(wasCorrect)}
                />
            </div>
        );
    }

    renderNav() {
        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Toggle />
                    <Navbar.Brand>
                        <a href="/">Andrew's Trivia</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} onClick={() => this.generateNewQuiz()}>New Quiz</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <Navbar.Text>Total Questions: {this.state.stats.totalQuestions}</Navbar.Text>
                        <Navbar.Text>Total Correct: {this.state.stats.totalCorrectAnswers}</Navbar.Text>
                        <NavItem eventKey={1} onClick={() => this.clearStats()}>Reset Stats</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    updateStats(wasCorrect) {
        this.setState(
            {
                stats: {
                    totalQuestions: this.state.stats.totalQuestions + 1,
                    totalCorrectAnswers: (wasCorrect) ? this.state.stats.totalCorrectAnswers + 1 : this.state.stats.totalCorrectAnswers
                }
            },
            this.updateCookies
        );
    }

    updateCookies() {
        cookie.save('correctAnswers', this.state.stats.totalCorrectAnswers, {path: '/'});
        cookie.save('totalQuestions', this.state.stats.totalQuestions, {path: '/'});
    }

    clearStats() {
        this.setState({
            stats: {
                totalQuestions: 0,
                totalCorrectAnswers: 0
            }
        });
        this.clearCookies();
    }

    clearCookies() {
        cookie.remove('correctAnswers');
        cookie.remove('totalQuestions');
    }
}

export default Trivia