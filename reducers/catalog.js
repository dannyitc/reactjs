import { handleActions } from 'redux-actions';

import actions from 'src/actions/catalog';

export const name = 'catalog';

const initialState = {
    rootCategoryId: -1,
    currentCategoryId: null,
    currentParrentId: null,
    currentRootId: null,
    currentPage: 1,
    pageSize: 8,
    prevPageTotal: null,
    chosenFilterOptions: [],
    originFilterOptions: {},
    currentFilterOptions: {},
    currentSortBy: 'position',
    currentDirection: 'ASC',
    reviewPayload: {
        nickname: '',
        title: '',
        detail: '',
        ratings: {}
    },
    isPopupCompareOpen: false,
    isPopupShareOpen: false,
    storeConfig: {
        display_product_stock_status: true,
        tax_display_type: 1,
        tax_cart_display_price: 1,
        base_currency_code: 'USD',
        catalog_review_active: true,
        catalog_review_allow_guest: true,
        layered_display_count: true,
        redirect_to_cart: false,
        allow_guest_checkout: true,
        productalert_allow_stock: false,
        enable_contact: false,
        min_order_amount: 0,
        enable_min_order_amount: false
    }
};

const reducerMap = {
    [actions.setCurrentPage.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            currentPage: payload
        };
    },
    [actions.setPrevPageTotal.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            prevPageTotal: payload
        };
    },
    [actions.updateChosenFilterOptions]: (
        state,
        { payload }
    ) => {
        return {
            ...state,
            chosenFilterOptions: payload
        };
    },
    [actions.setLimit.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            pageSize: payload
        };
    },
    [actions.setCurrentSortBy.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            currentSortBy: payload
        };
    },
    [actions.setCurrentDirection.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            currentDirection: payload
        };
    },
    [actions.updateOriginFilterOptions]: (
        state,
        { payload: { categoryId, filterOptions } }
    ) => {
        return categoryId
            ? {
                ...state,
                originFilterOptions: {
                    ...state.originFilterOptions,
                    [categoryId]: filterOptions
                }
            }
            : {
                ...state,
                originFilterOptions: {}
            };
    },
    [actions.updateCurrentFilterOptions]: (
        state,
        { payload: { categoryId, filterOptions } }
    ) => {
        return categoryId
            ? {
                ...state,
                currentFilterOptions: {
                    ...state.currentFilterOptions,
                    [categoryId]: filterOptions
                }
            }
            : {
                ...state,
                currentFilterOptions: {}
            };
    },
    [actions.setCurrentCategoryId.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        const pathList = payload ? payload.path.replace(/\s/g, '').split('/') : null;

        return {
            ...state,
            currentCategoryId: payload ? payload.id : null,
            currentParrentId: pathList && pathList.length > 2 ? pathList[2] : null
        };
    },
    [actions.setCurrentRootId.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            currentRootId: payload
        };
    },
    [actions.addReview.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            reviewPayload: payload
        };
    },
    [actions.openComparePopup.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            isPopupCompareOpen: payload
        };
    },
    [actions.openSharePopup.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            isPopupShareOpen: payload
        };
    },
    [actions.getProductConfig.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            storeConfig: {
                ...state.storeConfig,
                display_product_stock_status: payload.display_product_stock_status,
                tax_display_type: payload.tax_display_type,
                base_currency_code: payload.base_currency_code,
                tax_cart_display_price: payload.tax_cart_display_price,
                catalog_review_active: payload.catalog_review_active,
                catalog_review_allow_guest: payload.catalog_review_allow_guest,
                layered_display_count: payload.layered_display_count,
                redirect_to_cart: payload.redirect_to_cart,
                allow_guest_checkout: payload.allow_guest_checkout,
                productalert_allow_stock: payload.productalert_allow_stock,
                enable_contact: payload.enable_contact,
                min_order_amount: payload.min_order_amount,
                enable_min_order_amount: payload.enable_min_order_amount
            }
        };
    }
};

export default handleActions(reducerMap, initialState);