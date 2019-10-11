import { RestApi } from '@magento/peregrine';
import graphqlService from 'src/services/graphql';
import actions from './actions';
import { toast } from "react-toastify";
const { request } = RestApi.Magento2;
const { graphql } = graphqlService;

export const setCurrentPage = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentPage.receive(payload));
    };

export const setPrevPageTotal = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setPrevPageTotal.receive(payload));
    };

export const addReview = (payload = {}) => {
    return async function thunk(dispatch) {
        dispatch(actions.addReview.request(payload));

        try {
            await request(
                `/rest/V1/product/review`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload)
                }
            );

            dispatch(actions.addReview.receive({
                nickname: '',
                title: '',
                detail: '',
                ratings: {}
            }));
            toast.success('You submitted your review for moderation.');
        } catch (error) {
            dispatch(actions.addReview.receive(error));
            toast.error("Something wrong.Please try again");
        }
    };
};

export const setLimit = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setLimit.receive(payload));
    };

export const setCurrentSortBy = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentSortBy.receive(payload));
    };

export const setCurrentDirection = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentDirection.receive(payload));
    };
export const setCurrentCategoryId = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentCategoryId.receive(payload));
    };
export const setCurrentRootId = payload =>
    async function thunk(dispatch) {
        dispatch(actions.setCurrentRootId.receive(payload));
    };
export const updateChosenFilterOptions = payload =>
    async function thunk(dispatch) {
        dispatch(actions.updateChosenFilterOptions(payload));
    };
export const openComparePopup = payload =>
    async function thunk(dispatch) {
        dispatch(actions.openComparePopup.receive(payload));
    };
export const openSharePopup = payload =>
    async function thunk(dispatch) {
        dispatch(actions.openSharePopup.receive(payload));
    };
export const setCategoryData = (id) =>
    async function thunk(...args) {
        const [dispatch] = args;

        if (!id) {
            dispatch(actions.setCurrentCategoryId.reject());
            return;
        }

        try {
            const params = {
                query: `
                    query category($id: Int) {
                        category(id: $id) {
                            id
                            path
                        }
                    }
                `.trim(),
                variables: {
                    id: id
                }
            }
            const data = await graphql(params);
            dispatch(actions.setCurrentCategoryId.receive(data.category));
        } catch (error) {
            // TODO: Handle error
            dispatch(actions.setCurrentCategoryId.reject());
            console.log(error);
        }
    };
export const getProductConfig = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        try {
            const params = {
                query: `
                    query storeConfig {
                        storeConfig {
                            display_product_stock_status
                            tax_display_type
                            tax_cart_display_price
                            base_currency_code
                            catalog_review_active
                            catalog_review_allow_guest
                            layered_display_count
                            redirect_to_cart
                            allow_guest_checkout
                            productalert_allow_stock
                            enable_contact
                            min_order_amount
                            enable_min_order_amount
                        }
                    }
                `.trim()
            }
            const data = await graphql(params);
            dispatch(actions.getProductConfig.receive(data ? data.storeConfig : {}));
        } catch (error) {
            // TODO: Handle error
            dispatch(actions.getProductConfig.reject());
            console.log(error);
        }
    };