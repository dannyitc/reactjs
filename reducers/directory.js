import { handleActions } from 'redux-actions';

import actions from 'src/actions/directory';

export const name = 'directory';

const initialState = {};

const reducerMap = {
    [actions.getCountries]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            countries: payload
        };
    },
    [actions.getDirectoryConfig]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            directory_config: payload
        };
    }
};

export default handleActions(reducerMap, initialState);
