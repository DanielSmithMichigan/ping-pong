import React, { Component } from 'react';
import { connect } from 'react-redux';
import Homepage from './homepage/component.js';
import Matchpage from './matchpage/component.js';
import LeagueHistory from './league-history/component.js';
import {resetStore} from './store-root';

class App extends Component {
    componentWillMount() {
        this.props.resetStore();
    }
    render() {
        return (
            <React.Fragment>
                <div className="background-top" />
                <div className="content">
                    {this.props.page === 'homepage' && <Homepage />}
                    {this.props.page === 'matchpage' && <Matchpage />}
                    {this.props.page === 'league-history' && <LeagueHistory />}
                </div>
                <div className="background-bottom" />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        page: (state.router || {}).page
    }
}

const mapDispatchToProps = {
    resetStore
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
