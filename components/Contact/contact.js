import React, { Component, Fragment } from 'react';
import { Form } from 'informed';
import memoize from 'memoize-one';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';

import Button from 'src/components/Button';
import defaultClasses from './contact.css';
import {
    isRequired,
    validateEmail
} from 'src/util/formValidators';
import combine from 'src/util/combineValidators';
import TextInput from 'src/components/TextInput';
import TextArea from 'src/components/TextArea';
import Field from 'src/components/Field';
import { contactUs } from 'src/mutations/contactUs';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { toast } from "react-toastify";

const fields = [
    'name',
    'email',
    'phome',
    'comment'
];

const filterInitialValues = memoize(values =>
    fields.reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
    }, {})
);

class Contact extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            button: string,
            email: string,
            name: string,
            footer: string,
            telephone: string,
            comment: string
        }),
        submit: func
    };

    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    static defaultProps = {
        initialValues: {}
    };

    render() {
        const { children, props } = this;
        const { classes, initialValues } = props;
        const values = filterInitialValues(initialValues);

        return (
            <Form
                className={classes.contactForm}
                initialValues={values}
                onSubmit={this.submit}
            >
                {children}
            </Form>
        );
    }

    children = () => {
        const { classes } = this.props;

        return (
            <Fragment>
                <div className={classes.body}>
                    <h2>Write Us</h2>
                    <p className={classes.subTitle}>Jot us a note and we’ll get back to you as quickly as possible.</p>
                    <div className={classes.formContent}>
                        <div className={classes.name}>
                            <Field required={true} className={classes.contactField} label="Name">
                                <TextInput
                                    className={classes.textInput}
                                    id={classes.name}
                                    field="name"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                        <div className={classes.lastname}>
                            <Field required={true} className={classes.contactField} label="Email">
                                <TextInput
                                    className={classes.textInput}
                                    id={classes.email}
                                    field="email"
                                    validate={combine([isRequired, validateEmail])}
                                />
                            </Field>
                        </div>
                        <div className={classes.telephone}>
                            <Field className={classes.contactField} label="Phone Number">
                                <TextInput
                                    className={classes.textInput}
                                    id={classes.phone}
                                    field="phone"
                                />
                            </Field>
                        </div>
                        <div className={classes.telephone}>
                            <Field required={true} className={classes.contactField} label="What’s on your mind?">
                                <TextArea
                                    field="comment"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                    </div>
                    {this.state.isLoading
                        ? (<div className={classes.itemActionLoading}>
                            <LoadingIndicator>Submitting...</LoadingIndicator>
                        </div>)
                        : null
                    }
                </div>
                <div className={classes.footer}>
                    <Button
                        className={classes.button}
                        type="submit"
                        priority="high"
                    >
                        Submit
                    </Button>
                </div>
            </Fragment>
        );
    };

    submit = values => {
        const { client, onClose } = this.props;
        this.setState({ isLoading: true });
        client.mutate({
            mutation: contactUs,
            variables: values
        }).then((data) => {
            console.log(data);
            toast.success('Thanks for contacting us with your comments and questions. We\'ll respond to you very soon.');
        }).catch(error => {
            console.log(error);
            toast.error("Something wrong.Please try again");
        }).finally(() => {
            this.setState({ isLoading: false });
            onClose();
        });

    };
}

export default compose(
    withApollo,
    classify(defaultClasses)
)(Contact);
