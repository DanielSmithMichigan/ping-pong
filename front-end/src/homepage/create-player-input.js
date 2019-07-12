import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import config from '../config';
import {
    setPlayerAttribute,
    setPageAttribute
} from './store.js';
import {
    getAllPlayers,
    addPlayer
} from '../shared/player-store.js';

const defaultPlayer = {
    elo: config.defaultInitialElo,
    name: "Name"
};

class CreatePlayerInput extends Component {
    render() {
        if (this.props['create-player-input'] === 'closed') {
            return this.getButton();
        }
        return (
            <React.Fragment>
                {this.getButton()}
                {this.getModal()}
            </React.Fragment>
        );
    }
    clr(attr) {
        return () => {
            this.props.setPlayerAttribute(attr,"");
        }
    }
    getModal() {
        return (
            <div className="overlay create-player-input">
                <div className="modal">
                    <div className="create-player">
                        <form onSubmit={this.createPlayer.bind(this)}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="input-label">
                                                Name
                                            </div>
                                        </td>
                                        <td>
                                            <input type="text"
                                                value={this.props.player.name}
                                                className="input-value"
                                                onFocus={this.clr("name")}
                                                onChange={this.setPlayerAttribute.bind(this, "name")}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input-label">
                                                Initial ELO
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={this.props.player.elo}
                                                className="input-value"
                                                onFocus={this.clr("elo")}
                                                onChange={this.setPlayerAttribute.bind(this, "elo")} />
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
                    </div>
                </div>
            </div>
        );
    }
    getButton() {
        return (
            <button className="btn btn-red btn-rounded page-link"
                onClick={this.openModal.bind(this)}>
                ADD PLAYER
            </button>
        );
    }
    setPlayerAttribute(key, event) {
        this.props.setPlayerAttribute(key, event.target.value);
    }
    closeModal() {
        this.props.setPageAttribute('create-player-input', 'closed');
        this.props.setPageAttribute('message', '');
    }
    openModal() {
        this.props.setPageAttribute('create-player-input', 'open');
        this.props.setPageAttribute('message', '');
        this.props.setPlayerAttribute("elo", defaultPlayer.elo);
        this.props.setPlayerAttribute("name", defaultPlayer.name);
    }
    createPlayer(event) {
        this.props.setPageAttribute('create-player-input', 'closed');
        this.props.setPageAttribute('message', 'Creating player...');
        this.props.addPlayer(this.props.player)
            .then(() => {
                this.props.setPageAttribute('message', 'Player created successfully');
                return this.props.getAllPlayers();
            });
        event.preventDefault();
    }
}

const mapStateToProps = state => {
    return {
        player: (state.homepage || {}).player || {},
        ["create-player-input"]: (state.homepage || {})["create-player-input"] || "closed"
    };
}

const mapDispatchToProps = {
    addPlayer,
    setPlayerAttribute,
    setPageAttribute,
    getAllPlayers
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreatePlayerInput)
