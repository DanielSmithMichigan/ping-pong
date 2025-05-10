import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreatePlayerInput from './create-player-input.js';
import PlayerTable from './player-table';
import { setPageAttribute } from './store.js';
import { gotoPage } from '../router.js';
import { getAllPlayers } from '../shared/player-store.js';
import _ from 'lodash';

class Homepage extends Component {
    componentDidMount() {
        this.props.setPageAttribute("message", "Retrieving players");
        this.props.getAllPlayers().then(() => {
            this.props.setPageAttribute("message", "");
        });
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f4f4f4',
                height: '100vh',
                padding: '20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                }}>
                    PING PONG / ELO TRACKER
                </div>
                <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                    TRACK THE RANKINGS OF YOUR FRIENDS
                </div>
                <PlayerTable />
                <CreatePlayerInput />
                {this.renderBeginMatchButton()}
            </div>
        );
    }

    renderBeginMatchButton() {
        if (!this.props.playerOneId || !this.props.playerTwoId) {
            return null;
        }
        return (
            <button style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}
                onClick={this.beginMatch.bind(this)}>
                CHALLENGE A FRIEND
            </button>
        );
    }

    beginMatch() {
        this.props.gotoPage("matchpage");
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

function sortByElo(players) {
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
)(Homepage);
