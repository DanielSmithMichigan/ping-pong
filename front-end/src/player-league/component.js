import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import config from '../config';
import _ from 'lodash'

class PlayerLeague extends Component {
    render() {
        let style = {
            color: `#${this.props.color}`
        };
        return (
            <span className="player-league" style={style}>
                the {this.props.title}
            </span>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let elo = _.get(ownProps, "player.elo", 0);
    let rank = _.find(config.ranking, qualified(elo));
    return {
        title: _.get(rank, "title"),
        color: _.get(rank, "color", "ffffff")
    }
}

function qualified(elo) {
    return (rank) => {
        return elo >= rank.elo;
    };
}

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerLeague)
