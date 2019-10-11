import { RestApi } from '@magento/peregrine';

import actions from './actions';
import graphqlService from 'src/services/graphql';
const { graphql } = graphqlService;

const { request } = RestApi.Magento2;


export const getCountries = () =>
    async function thunk(dispatch, getState) {
        const { directory } = getState();

        if (directory && directory.countries) {
            return;
        }

        try {
            const response = await request('/rest/V1/directory/countries');

            dispatch(actions.getCountries(response));
        } catch (error) {
            dispatch(actions.getCountries(error));
        }
    };

export const getDirectoryConfig = () =>
    async function thunk(dispatch) {

        try {
            const params = {
                query: `
                    query storeConfig {
                        storeConfig {
                            default_country
                            state_require_for
                            allow_choose_state
                        }
                    }
                `.trim()
            }
            const data = await graphql(params);

            dispatch(actions.getDirectoryConfig(data.storeConfig));
        } catch (error) {
            dispatch(actions.getDirectoryConfig(error));
        }
    };
