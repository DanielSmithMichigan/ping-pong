import fetch from 'cross-fetch';
export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case "REPORT_MATCH_RESULT_SUCCESS":
            return {
                ...state,
                ratingAdjustments: action.ratingAdjustments
            }
        case "GET_PLAYERS_LIST":
            return {
                ...state,
                allPlayers: action.allPlayers
            };
        case "MATCH_INFORMATION":
            return {
                ...state,
                matchInformation: action.data
            };
        case "CLEAR_MATCH_INFORMATION":
            return {
                ...state,
                matchInformation: undefined
            };
        default:
            return state;
    }
};

export function reportMatch(result) {
    return dispatch => {
        return fetch("https://b4i0ooqf6g.execute-api.us-east-1.amazonaws.com/latest/matches/report", {
            method: 'POST',
            // mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        })
        .then((response) => {
            return response.json();
        })
        .then((ratingAdjustments) => {
            dispatch({
                type: "REPORT_MATCH_RESULT_SUCCESS",
                ratingAdjustments
            });
        })
        .catch((err) => dispatch({
            type: "FAILURE",
            message: err
        }));
    };
}

export function getMatchInformation(playerOneId, playerTwoId) {
    return dispatch => {
        return fetch(`https://b4i0ooqf6g.execute-api.us-east-1.amazonaws.com/latest/matches/getInformation/${playerOneId}/${playerTwoId}`, {
            method: 'GET',
            // mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            dispatch({
                type: "MATCH_INFORMATION",
                data: response
            });
        })
        .catch((err) => dispatch({
            type: "FAILURE",
            message: err
        }));
    }
}

export function clearMatchInformation() {
    return dispatch => {
        return new Promise((resolve) => {
            dispatch({
                type: "CLEAR_MATCH_INFORMATION"
            });
            resolve();
        });
    }
}