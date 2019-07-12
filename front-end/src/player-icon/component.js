import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import _ from 'lodash';

class PlayerIcon extends Component {
    componentDidMount() {
        document.fonts.load('10pt "Zoologic"')
    }
    render() {
        return (
            <React.Fragment>
                <div className="player-icon">
                    <div className="player-icon-symbol">
                        {getLetter(this.props.playerName)}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function getLetter(name) {
    return _.chain(name)
        .split(" ")
        .first()
        .last()
        .value();
}

const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerIcon)
