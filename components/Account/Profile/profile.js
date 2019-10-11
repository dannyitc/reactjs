import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './profile.css';
import { validators } from './validators';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import gql from 'graphql-tag';
import { Form } from 'informed';
import Button from 'src/components/Button';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import { toast } from "react-toastify";
import Checkbox from 'src/components/Checkbox';

const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($input: CustomerInput!) {
    updateCustomer(input: $input) {
        customer {
            firstname
            lastname
            email
        }
    }
  }
`;
const CHANGE_PASSWORD = gql`
  mutation changeCustomerPassword($currentPassword: String!, $newPassword: String!) {
    changeCustomerPassword(currentPassword: $currentPassword,newPassword: $newPassword) {
        firstname
        lastname
        email
    }
  }
`;

class CustomerProfile extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            change_email: false,
            change_password: false
        };
    }

    state = {
        firstname: '',
        lastname: '',
        email: '',
        newpassword: '',
        confirmpassword: ''
    };

    render() {
        const { classes, currentUser } = this.props;
        const { firstname, lastname, email } = currentUser;
        const { change_email, change_password } = this.state;
        let title = '';
        if (change_email && change_password) {
            title = 'Change Email and Password';
        } else if (change_email) {
            title = 'Change Email';
        } else if (change_password) {
            title = 'Change Password';
        }

        return (
            <Form
                className={classes.formEditAccount}
                onSubmit={this.submit}
            >
                {this.state.isLoading
                    ? (<div className={classes.itemActionLoading}>
                        <LoadingIndicator>Saving...</LoadingIndicator>
                    </div>)
                    : null
                }
                <h1>My Profile</h1>
                <div className={classes.profileInfo}>
                    <strong className={classes.boxTitle}>
                        <span>Edit My Profile Information</span>
                    </strong>
                    <div className={classes.formFields}>
                        <Field required={true} label="First Name">
                            <TextInput
                                initialValue={firstname}
                                field="firstname"
                                autoComplete="given-name"
                                validate={validators.get('firstName')}
                                validateOnBlur
                            />
                        </Field>
                        <Field required={true} label="Last Name">
                            <TextInput
                                initialValue={lastname}
                                field="lastname"
                                autoComplete="family-name"
                                validate={validators.get('lastName')}
                                validateOnBlur
                            />
                        </Field>
                    </div>
                </div>
                <div className={classes.selection}>
                    <Checkbox
                        field="change_email"
                        label="Change Email"
                        onChange={this.handleChangeEmail}
                    />
                    <Checkbox
                        field="change_password"
                        label="Change Password"
                        onChange={this.handleChangePassword}
                    />
                </div>
                {
                    (change_email || change_password) &&
                    <div className={classes.changePassword}>
                        <strong className={classes.boxTitle}>
                            <span>{title}</span>
                        </strong>
                        {change_email &&
                            <Field required={true} label="Email">
                                <TextInput
                                    initialValue={email}
                                    field="email"
                                    validate={validators.get('email')}
                                />
                            </Field>
                        }
                        <Field required={true} label="Current Password">
                            <TextInput
                                field="current_password"
                                type="password"
                                validate={validators.get('password')}
                                validateOnBlur
                            />
                        </Field>
                        {change_password &&
                            <Fragment>
                                <Field required={true} label="Password">
                                    <TextInput
                                        field="password"
                                        type="password"
                                        autoComplete="new-password"
                                        validate={validators.get('new_password')}
                                        validateOnBlur
                                    />
                                </Field>
                                <Field required={true} label="Confirm Password">
                                    <TextInput
                                        field="confirm"
                                        type="password"
                                        validate={validators.get('confirm')}
                                        validateOnBlur
                                    />
                                </Field>
                            </Fragment>
                        }
                    </div>
                }
                <div className={classes.actions}>
                    <Button type="submit" priority="high">
                        {'Save'}
                    </Button>
                </div>
            </Form>
        );
    }

    handleChangeEmail = () => {
        this.setState({ change_email: !this.state.change_email })
    }

    handleChangePassword = () => {
        this.setState({ change_password: !this.state.change_password })
    }

    goToDashboard = () => {
        this.props.onChangeTab(0);
    }

    submit = values => {
        const { client, getUserDetails } = this.props;
        const newCustomerData = {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            password: values.current_password
        }
        this.setState({ isLoading: true });
        client.mutate({
            mutation: UPDATE_CUSTOMER,
            variables: { input: newCustomerData }
        }).then(result => {
            console.log(result);
            if (values.password && values.confirm) {
                client.mutate({
                    mutation: CHANGE_PASSWORD,
                    variables: { currentPassword: values.current_password, newPassword: values.password }
                }).then(() => {
                    toast.success('You have updated your profile successfully.');
                    getUserDetails();
                }).catch((error) => {
                    console.log(error);
                    toast.error("Something's wrong.Please try again");
                });
            } else {
                getUserDetails();
                toast.success('You have updated your profile successfully.');
            }
        }).catch((error) => {
            let message = "Something's wrong.Please try again";
            if (error.graphQLErrors) {
                message = error.graphQLErrors[0].message
            }
            toast.error(message);
        }).finally(() => {
            this.setState({ isLoading: false }, () => {
                this.goToDashboard();
            });
        });
    };
}

export default compose(
    withApollo,
    classify(defaultClasses)
)(CustomerProfile);
