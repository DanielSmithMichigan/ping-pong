import React, { Component } from 'react';
import { connect } from 'react-redux';
import { VictoryLine, VictoryTheme, VictoryChart, VictoryLegend } from 'victory';
import './style.css';
import {
    gotoPage
} from '../router.js';

import _ from 'lodash';

// #

class LeagueHistory extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div className="league-history">
                <div className="foreground">
                    <div className="title">
                        History
                    </div>
                    {this.homeButton()}
                    <div className="elo-history-chart">
                        <VictoryChart theme={VictoryTheme.material}>
                            <VictoryLine
                                interpolation="natural"
                                style={{
                                    data: { stroke: "#ff397f" },
                                    parent: { border: "none"}
                                }}
                                data={this.getData()}
                                x="quarter"
                                y="earnings"
                            />
                        </VictoryChart>
                    </div>
                </div>
            </div>
        );
    }
    getData() {
        return [
            {quarter: 1, earnings: 13000},
            {quarter: 2, earnings: 16500},
            {quarter: 3, earnings: 14250},
            {quarter: 4, earnings: 0}
        ];
    }
    homeButton() {
        return (
            <button className="btn btn-red btn-rounded page-link"
                onClick={this.props.gotoPage.bind(this, "homepage")}>
                HOME
            </button>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = {
    gotoPage
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LeagueHistory)
