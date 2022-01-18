import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

// alert: {id: string, msg: string, alertType: "success" | "danger"}

const Alert = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}

export default Alert;