import React, { Component, Fragment } from 'react';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { Form } from 'informed';
import gql from 'graphql-tag';
import { toast } from "react-toastify";
import classify from 'src/classify';
import { withRouter } from 'react-router-dom';
import globalClasses from 'src/index.css';
import defaultClasses from './resetPassword.css';
const VALIDATE_LINK_TOKEN = gql`
  mutation validateLinkToken($token: String!) {
    validateLinkToken(token: $token)
  }
`;

const CREATE_NEW_PASSWORD = gql`
    mutation createNewPassword($token: String!,$password: String!) {
        createNewPassword(token: $token, password: $password)
    }
`;

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validate: false
        };
    }

    componentWillMount() {
        let searchParams = new URLSearchParams(window.location.search);
        let token = searchParams.get('token')
        this.setState(
            { token: token }
        )
        this.validateLink(token);
    }

    validateLink = token => {
        const { client, history } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: VALIDATE_LINK_TOKEN,
            variables: { token: token }
        }).then(result => {
            if (result.data.validateLinkToken) {
                this.setState(
                    { validate: true }
                )
            } else {
                this.setState(
                    { validate: false }
                )
                history.push('/')
            }
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    }

    handleOnSubmit = values => {
        const { client, history } = this.props;

        this.setState({ isLoading: true });
        const token = this.state.token;
        if (values.password != values.password_confirm) {
            toast.error('confirm password wrong');
            return false;
        }
        client.mutate({
            mutation: CREATE_NEW_PASSWORD,
            variables: { token: token, password: values.password }
        }).then(result => {
            console.log(result);
            toast.success('You have updated your account.');
            history.push('/')
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    }

    componentDidMount() {
        document.title = 'Create new password';
    }

    render() {
        const { validate } = this.state;
        const { pageContainer } = globalClasses;
        const { classes } = this.props;
        return (
            <Fragment>
                {validate ?
                    <div className={pageContainer}>
                        <div className={classes.resetPasswordForm}>
                            <h2>{'Create New Password'}</h2>
                            <Form
                                onSubmit={this.handleOnSubmit}
                            >
                                <Input
                                    label="New Password"
                                    type="password"
                                    field="password"
                                    required
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    field="password_confirm"
                                    required
                                />
                                <div>
                                    <Button type="submit" priority="high">
                                        {'Set a new password'}
                                    </Button>
                                </div>
                            </Form >
                        </div>
                    </div>
                    : null
                }
            </Fragment>
        )

    }
}


export default compose(
    withRouter,
    withApollo,
    classify(defaultClasses)
)(ResetPassword);