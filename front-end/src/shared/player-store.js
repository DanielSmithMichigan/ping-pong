import fetch from 'cross-fetch';
import _ from 'lodash';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case "CLEAR_SELECTED_PLAYERS":
            return {
                ...state,
                playerOneId: undefined,
                playerTwoId: undefined
            }
        case "SELECT_PLAYER":
            let output = {
                ...state
            };
            if (output.playerOneId === action.playerId) {
                output.playerOneId = undefined;
            } else if (output.playerTwoId === action.playerId) {
                output.playerTwoId = undefined;
            } else if (output.playerOneId) {
                output.playerTwoId = action.playerId;
            } else {
                output.playerOneId = action.playerId;
            }
            return output;
        case "GET_ALL_PLAYERS":
            return {
                ...state,
                allPlayers: action.allPlayers
            };
        default:
            return {
                ...state
            };
    }
};



export function addPlayer(playerObject) {
    return dispatch => {
        return fetch("https://8q7xlufrm6.execute-api.us-east-1.amazonaws.com/latest/players/create", {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerObject)
        })
        .then(() => {
            dispatch({
                type: "ADD_PLAYER_SUCCESS"
            })
        })
        .catch((err) => dispatch({
            type: "FAILURE",
            message: err
        }));
    };
};

export function getAllPlayers() {
    return (dispatch) => {
        return fetch("https://8q7xlufrm6.execute-api.us-east-1.amazonaws.com/latest/players/getAll", {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((allPlayers) => {
            return dispatch({
                type: "GET_ALL_PLAYERS",
                allPlayers
            });
        })
        .catch((err) => {
            return dispatch({
                type: "FAILURE",
                message: err
            });
        });
    };
};

export function clearSelectedPlayers(key, value) {
    return (dispatch) => {
        return dispatch({
            type: "CLEAR_SELECTED_PLAYERS"
        });
    };
};

export function selectPlayer(playerId) {
    return (dispatch) => {
        return dispatch({
            type: "SELECT_PLAYER",
            playerId
        });
    };
};