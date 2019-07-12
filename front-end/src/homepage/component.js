import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import CreatePlayerInput from './create-player-input.js';
import PlayerTable from './player-table';
import {
    setPageAttribute
} from './store.js';
import {
    gotoPage
} from '../router.js';
import {
    getAllPlayers
} from '../shared/player-store.js';

import _ from 'lodash';

class Homepage extends Component {
    componentDidMount() {
        this.props.setPageAttribute("message", "Retrieving players");
        this.props.getAllPlayers()
            .then(() => {
                this.props.setPageAttribute("message", "");
            });
    }
    render() {
        return (
            <div className="homepage">
                <div className="foreground">
                    <div className="title">
                        ELO Tracker
                    </div>
                    <div className="message">
                        {this.props.message}
                    </div>
                    <div>
                        {this.leagueHistoryButton()}
                    </div>
                    <CreatePlayerInput />
                    <PlayerTable />
                    {this.renderBeginMatchButton()}
                </div>
            </div>
        );
    }
    leagueHistoryButton() {
        return (
            <button className="btn btn-red btn-rounded page-link"
                onClick={this.props.gotoPage.bind(this, "league-history")}>
                HISTORY
            </button>
        );
    }
    renderBeginMatchButton() {
        if (!this.props.playerOneId
                || !this.props.playerTwoId) {
            return null;
        }
        return (
            <button className="btn btn-red btn-rounded page-link"
                onClick={this.beginMatch.bind(this)}>
                BEGIN MATCH
            </button>
        );
    }
    beginMatch() {
        this.props.gotoPage("matchpage");
    }
    openCreatePlayerInput() {
        this.props.setPageAttribute("create-player-input", "open");
        this.props.setPageAttribute("message", "");
    }
}

const mapStateToProps = state => {
    return {
        message: (state.homepage || {}).message || "",
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
    getAllPlayers
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Homepage)
