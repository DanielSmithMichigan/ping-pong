import _ from 'lodash';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case "SET_PAGE_ATTRIBUTE":
            return {
                ...state,
                [action.key]: action.value
            }
        case "SET_PLAYER_ATTRIBUTE":
            let player = {
                ...state.player
            };
            player[action.key] = action.value;
            return {
                ...state,
                player
            };
        case "SELECT_PLAYER":
            let selectedPlayers = (state.selectedPlayers || []).slice();
            if (!selectedPlayers.includes(action.playerId)) {
                selectedPlayers.push(action.playerId);
            }
            return {
                ...state,
                selectedPlayers
            };
        default:
            return {
                ...state
            };
    }
};

export function setPageAttribute(key, value) {
    return dispatch => {
        return dispatch({
            type: "SET_PAGE_ATTRIBUTE",
            key,
            value
        });
    };
}

export function setPlayerAttribute(key, value) {
    return dispatch => {
        return dispatch({
            type: "SET_PLAYER_ATTRIBUTE",
            key,
            value
        });
    };
}

export function selectPlayer(playerId) {
    return dispatch => {
        return dispatch({
            type: "SELECT_PLAYER",
            playerId
        });
    };
}