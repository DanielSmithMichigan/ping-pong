import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import _ from 'lodash';
import {
    updatePlayerScore,
    updatePageAttribute
} from './store.js';
import {
    reportMatch,
    getMatchInformation
} from '../api.js';

import {
    getAllPlayers
} from '../shared/player-store.js';

class ReportMatchResult extends Component {
    componentDidMount() {
        this.props.updatePageAttribute("modalState", "closed");
    }
    render() {
        let modal = null;
        if (this.props.modalState === "opened") {
            modal = this.getModal();
        }
        return (
            <React.Fragment>
                {modal}
                <div className="btn-container">
                    <div className="btn btn-red btn-rounded"
                         onClick={this.openModal.bind(this)}>
                        Report Match Result
                    </div>
                </div>
            </React.Fragment>
        );
    }
    getModal() {
        return (
            <React.Fragment>
                <div className="overlay">
                    <div className="modal">
                        {this.getModalContent()}
                    </div>
                </div>
            </React.Fragment>
        )
    }
    getModalContent() {
        if (!this.props.message) {
            return this.getForm();
        }
        return (
            <React.Fragment>
                {this.props.message}
            </React.Fragment>
        );
    }
    clrScore(playerId) {
        return () => {
            this.props.updatePlayerScore(playerId, "");
        }
    }
    getForm() {
        return (
            <form onSubmit={this.submitScore.bind(this)} className="report-match-result">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="player-name">
                                    {this.props.playerOne.name}
                                </div>
                            </td>
                            <td>
                                <input type="number"
                                    className="player-score"
                                    value={this.props.playerOneScore}
                                    onFocus={this.clrScore(this.props.playerOneId)}
                                    onChange={this.updatePlayerScore.bind(this, this.props.playerOneId)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="player-name">
                                    {this.props.playerTwo.name}
                                </div>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="player-score"
                                    value={this.props.playerTwoScore}
                                    onFocus={this.clrScore(this.props.playerTwoId)}
                                    onChange={this.updatePlayerScore.bind(this, this.props.playerTwoId)} />
                            </td>
                        </tr>
                        <tr>
                            <td className="submit-container" colSpan="2">
                                <input
                                    className="btn btn-small btn-red"
                                    type="submit" />
                            </td>
                        </tr>
                        <tr>
                            <td className="submit-container" colSpan="2">
                                <button
                                    className="btn btn-small btn-red"
                                    onClick={this.closeModal.bind(this)}>
                                    Close Modal
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
    submitScore(event) {
        let obj = {
            [this.props.playerOneId]: Number(this.props.playerOneScore),
            [this.props.playerTwoId]: Number(this.props.playerTwoScore)
        };
        this.props.updatePageAttribute("message", "Reporting match...");
        this.props.reportMatch(obj)
            .then((ratingAdjustments) => {
                this.props.updatePageAttribute("message", "");
                this.props.updatePageAttribute("modalState", "closed");
                return Promise.all([
                    this.props.getAllPlayers.call(this.props),
                    this.props.getMatchInformation.call(this.props, this.props.playerOneId, this.props.playerTwoId)
                ]);
            });
        event.preventDefault();
    }
    openModal() {
        this.props.updatePageAttribute("modalState", "opened");
        this.props.updatePlayerScore(this.props.playerOneId, 0);
        this.props.updatePlayerScore(this.props.playerTwoId, 0);
    }
    closeModal() {
        this.props.updatePageAttribute("modalState", "closed");
    }
    updatePlayerScore(playerId, event) {
        this.props.updatePlayerScore(playerId, event.target.value);
    }
}

const mapStateToProps = state => {
    let playerOneId = _.get(state, `playerStore.playerOneId`);
    let playerTwoId = _.get(state, `playerStore.playerTwoId`);
    let playerOneScore = ((state.reportMatchResult || {}).scores || {})[playerOneId];
    if (playerOneScore === "undefined") {
        playerOneScore = 0;
    }
    let playerTwoScore = ((state.reportMatchResult || {}).scores || {})[playerTwoId];
    if (playerTwoScore === "undefined") {
        playerTwoScore = 0;
    }
    return {
        modalState: (state.reportMatchResult || {}).modalState,
        message: (state.reportMatchResult || {}).message,
        playerOneId,
        playerOne: _.find(state.playerStore.allPlayers, {id: playerOneId}),
        playerOneScore,
        playerTwoId,
        playerTwo: _.find(state.playerStore.allPlayers, {id: playerTwoId}),
        playerTwoScore
    }
}

const mapDispatchToProps = {
    getAllPlayers,
    getMatchInformation,
    updatePlayerScore,
    updatePageAttribute,
    reportMatch
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportMatchResult)
