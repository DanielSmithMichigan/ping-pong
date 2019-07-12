import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayerCard from '../player-card/component.js';
import ReportMatchResult from '../report-match-result/component.js';
import MatchTable from '../match-table/component.js';
import './style.css';
import {
    gotoPage
} from '../router';
import {
    clearMatchInformation,
    getMatchInformation
} from '../api.js';
import _ from 'lodash';

class Matchpage extends Component {
    componentDidMount() {
        return this.props.clearMatchInformation()
            .then(() => {
                return this.props.getMatchInformation(this.props.playerOneId, this.props.playerTwoId);
            });
    }
    render() {
        return (
            <div className="match-page expand-all">
                <PlayerCard side="left" playerNum="One" />
                <ReportMatchResult />
                <MatchTable />
                <div className="btn-container back-to-homepage">
                    <div className="btn btn-red btn-rounded"
                         onClick={this.gotoHomepage.bind(this)}>
                        Back to homepage
                    </div>
                </div>
                <PlayerCard side="right" playerNum="Two" />
            </div>
        );
    }
    gotoHomepage() {
        this.props.gotoPage("homepage");
    }
}

const mapStateToProps = state => {
    return {
        playerOneId: (state.playerStore || {}).playerOneId,
        playerTwoId: (state.playerStore || {}).playerTwoId
    };
}

const mapDispatchToProps = {
    clearMatchInformation,
    getMatchInformation,
    gotoPage
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Matchpage)
