import { handleActions } from 'redux-actions';
import actions from 'src/actions/checkoutReceipt';

const initialState = {
    order: {},
    orderId: null,
    billing: {}
};

export default handleActions(
    {
        [actions.setOrderInformation]: (state, { payload }) => {
            const { order, billing, orderId } = state;
            return {
                ...state,
                order: payload.order ? payload.order : order,
                billing: payload.billing ? payload.billing : billing,
                orderId: payload.orderId ? payload.orderId : orderId
            }
        },
        [actions.reset]: () => initialState
    },
    initialState
);
