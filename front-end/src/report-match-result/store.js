import _ from 'lodash';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case "UPDATE_PLAYER_SCORE":
            _.set(state, `scores.${action.playerId}`, action.score);
            let playerScores = {
                ...state.scores
            };
            return {
                ...state,
                scores: playerScores
            };
        case "UPDATE_PAGE_ATTRIBUTE":
            return {
                ...state,
                [action.key]: action.value
            }
        default:
            return {
                ...state
            };
    }
};

export function updatePlayerScore(playerId, score) {
    return dispatch => {
        return dispatch({
            type: "UPDATE_PLAYER_SCORE",
            playerId,
            score
        });
    };
}

export function updatePageAttribute(key, value) {
    return dispatch => {
        return dispatch({
            type: "UPDATE_PAGE_ATTRIBUTE",
            key,
            value
        });
    };
}