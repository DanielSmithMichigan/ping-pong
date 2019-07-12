export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case "GOTO_PAGE":
            return {
                ...state,
                page: action.page
            };
        default:
            return {
                ...state
            };
    }
};

export function gotoPage(page) {
    return dispatch => {
        return dispatch({
            type: "GOTO_PAGE",
            page
        });
    };
}