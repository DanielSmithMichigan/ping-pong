import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import _ from 'lodash';

class MatchTable extends Component {
    render() {
        return (
            <div className="match-stats">
                <table cellSpacing="4px">
                    <tbody>
                        <tr>
                            <td colSpan="6"></td>
                            <td className="player-title">P1</td>
                            <td className="player-title">P2</td>
                        </tr>
                        <tr>
                            <td className="stat-name" colSpan="6">Expected Score</td>
                            <td>{
                                expectedScore(_.get(this.props.playerOneInformation, "expectedScore", 0))
                            }</td>
                            <td>{
                                expectedScore(_.get(this.props.playerTwoInformation, "expectedScore", 0))
                            }</td>
                        </tr>
                        <tr>
                            <td className="stat-name" colSpan="6">Expected Set Score</td>
                            <td>{
                                _.get(this.props.playerOneInformation, "expectedSetScore", 0)
                            }</td>
                            <td>{
                                _.get(this.props.playerTwoInformation, "expectedSetScore", 0)
                            }</td>
                        </tr>
                        <tr>
                            <td className="stat-name" colSpan="6">Historic Winrate</td>
                            <td>{
                                historicScore(this.props.matchStatistics, this.props.playerOneId)
                            }</td>
                            <td>{
                                historicScore(this.props.matchStatistics, this.props.playerTwoId)
                            }</td>
                        </tr>
                        <tr>
                            <td className="stat-name" colSpan="6">Total Score</td>
                            <td>{
                                _.get(this.props.matchStatistics, `scores.${this.props.playerOneId}`, 0)
                            }</td>
                            <td>{
                                _.get(this.props.matchStatistics, `scores.${this.props.playerTwoId}`, 0)
                            }</td>
                        </tr>
                        <tr>
                            <td colSpan="8">
                                Recent Results
                            </td>
                        </tr>
                        <tr>
                            <td className="player-title">
                                P1
                            </td>
                            {_.range(7).map((num) => {
                                return (<td className={getClassName(_.get(this.props.matchStatistics, `history.${num}`), this.props.playerOneId, this.props.playerTwoId)}>{
                                    _.get(this.props.matchStatistics, `history.${num}.${this.props.playerOneId}`, 0)
                                }</td>)
                            })}
                        </tr>
                        <tr>
                            <td className="player-title">
                                P2
                            </td>
                            {_.range(7).map((num) => {
                                return (<td className={getClassName(_.get(this.props.matchStatistics, `history.${num}`), this.props.playerTwoId, this.props.playerOneId)}>{
                                    _.get(this.props.matchStatistics, `history.${num}.${this.props.playerTwoId}`, 0)
                                }</td>)
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let playerOneId = _.get(state, `playerStore.playerOneId`);
    let playerTwoId = _.get(state, `playerStore.playerTwoId`);
    return {
        page: (state.routing || {}).page,
        playersList: (state.api || {}).playersList || [],
        playerOneId,
        playerTwoId,
        matchStatistics: _.get(state, `api.matchInformation.matchStatistics`),
        playerOneInformation: _.get(state, `api.matchInformation.${playerOneId}`),
        playerTwoInformation: _.get(state, `api.matchInformation.${playerTwoId}`)
    }
}

function getClassName(matchStats={}, playerId, opponentId) {
    if (matchStats[playerId] > matchStats[opponentId]) {
        return "win";
    }
    return "";
}

function expectedScore(score) {
    return _.round(score * 100);
}

function historicScore(matchStatistics, playerId) {
    let totalGames = _.get(matchStatistics, "totalGames", 0);
    let playerWins = _.get(matchStatistics, `scores.${playerId}`, 0);
    if (totalGames === 0) {
        return 0;
    }
    return _.round(playerWins / totalGames * 100);
}

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MatchTable)
