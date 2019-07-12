import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import CreatePlayerInput from './create-player-input.js';
import {
    setPageAttribute
} from './store.js';
import {
    gotoPage
} from '../router.js';
import {
    getAllPlayers,
    selectPlayer,
    clearSelectedPlayers
} from '../shared/player-store.js';

import _ from 'lodash';

class PlayerTable extends Component {
    componentDidMount() {
        this.props.clearSelectedPlayers();
    }
    render() {
        return (
            <div className="leaderboard">
                <table cellSpacing="4px">
                    <tbody>
                        <tr>
                            <th className="skinny" />
                            <th className="skinny">ELO</th>
                            <th>Name</th>
                        </tr>
                        {this.props.playersSortedByElo.map((playerData, key) => {return(
                            <tr
                                key={playerData.id}
                                onClick={this.selectPlayer.bind(this, playerData.id)}
                                className={this.playerRowStyle.call(this, playerData.id)}>
                                <td className="skinny">
                                    #{key + 1}
                                </td>
                                <td className="skinny">
                                    {_.round(playerData.elo)}
                                </td>
                                <td>
                                    {playerData.name}
                                </td>
                            </tr>
                        );})}
                    </tbody>
                </table>
            </div>
        );
    }
    playerRowStyle(playerId) {
        let output = [this.props.playerOneId, this.props.playerTwoId].includes(playerId)
            ? "selected"
            : "";
        return output;
    }
    selectPlayer(playerId) {
        this.props.selectPlayer(playerId);
    }
}

const mapStateToProps = state => {
    return {
        message: (state.PlayerTable || {}).message || "",
        playersSortedByElo: sortByElo((state.playerStore || {}).allPlayers || []),
        playerOneId: (state.playerStore || {}).playerOneId,
        playerTwoId: (state.playerStore || {}).playerTwoId
    }
}

function sortByElo (players) {
    return _.chain(players)
        .orderBy("elo")
        .reverse()
        .value();
}

const mapDispatchToProps = {
    gotoPage,
    setPageAttribute,
    getAllPlayers,
    selectPlayer,
    clearSelectedPlayers
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerTable)
