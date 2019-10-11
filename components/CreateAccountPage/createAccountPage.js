import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreateAccountForm from 'src/components/CreateAccount';
import classify from 'src/classify';
import defaultClasses from './createAccountPage.css';
import { getCreateAccountInitialValues } from './helpers';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import gql from 'graphql-tag';

const ASSIGN_ORDER = gql`
  mutation assignOrder($order: Int!) {
    assignOrder(order: $order)
  }
`;

class CreateAccountPage extends Component {
    static propTypes = {
        createAccount: PropTypes.func,
        initialValues: PropTypes.shape({}),
        history: PropTypes.shape({})
    };

    createAccount = accountInfo => {
        const { createAccount, history, client, orderId, viewOrderHistory, reset } = this.props;
        createAccount(accountInfo).then(() => {
            client.mutate({
                mutation: ASSIGN_ORDER,
                variables: { order: orderId }
            }).then(() => {
                reset();
                viewOrderHistory(history);
            }).catch((error) => {
                console.log(error);
            });
        });
    };

    render() {
        const initialValues = getCreateAccountInitialValues(
            window.location.search
        );
        const { isFetching, classes } = this.props;

        return (
            <div className={this.props.classes.container} >
                {isFetching &&
                    <div className={classes.loading}>
                        {loadingIndicator}
                    </div>
                }
                <CreateAccountForm
                    initialValues={initialValues}
                    onSubmit={this.createAccount}
                />
            </div >
        );
    }
}

export default classify(defaultClasses)(CreateAccountPage);
