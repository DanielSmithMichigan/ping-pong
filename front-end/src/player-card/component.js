import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import PlayerLeague from '../player-league/component.js';
import PlayerIcon from '../player-icon/component.js';
import _ from 'lodash';

class PlayerCard extends Component {
    render() {
        return (
            <div className={`match-page-player-info player-info-${this.props.side}`}>
                <div className={`player-card player-card-${this.props.side}`}>
                    <PlayerIcon playerName={this.props.player.name} />
                    <div className="player-info">
                        {this.getPlayerInfo()}
                    </div>
                </div>
            </div>
        );
    }
    getPlayerInfo() {
        return (
            <React.Fragment>
                <div className="elo">
                    {_.round(this.props.player.elo)}
                    {this.getRatingAdjustment()}
                </div>
                <div>
                    <span className="player-name">
                        {this.props.player.name},
                    </span>
                    <PlayerLeague player={this.props.player} />
                </div>
                <div className="player-history">
                    Sets Played: {this.props.player.totalGames} | Win PCT: {winPct(this.props.player)}%
                </div>
            </React.Fragment>
        );
    }
    getRatingAdjustment() {
        if (this.props.ratingAdjustment === 0) {
            return null;
        }
        let colorClass = this.props.ratingAdjustment >= 0 ? "positive" : "negative";
        let modifier = this.props.ratingAdjustment >= 0 ? "+" : "-";
        return (
            <span className={`rating-adjustment ${colorClass}`}>
                ({modifier}{Math.abs(_.round(this.props.ratingAdjustment, 2))})
            </span>
        );
    }
}

function winPct(player) {
    if (player.totalGames === 0) {
        return 0;
    }
    return _.round(player.totalWins / player.totalGames * 100);
}

const mapStateToProps = (state, ownProps) => {
    let playerId = _.get(state, `playerStore.player${ownProps.playerNum}Id`);
    return {
        playerId,
        player: _.find((state.playerStore || {}).allPlayers, {id: playerId}),
        ratingAdjustment: _.get(state, `api.ratingAdjustments.${playerId}`, 0)
    }
}

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerCard)
