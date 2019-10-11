import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { sendEmailToFriend } from 'src/actions/user';
import { connect } from 'src/drivers';
import { Form } from 'informed';
import defaultClasses from './shareProduct.css';
import globalClasses from 'src/index.css';
import {
    isRequired
} from 'src/util/formValidators';
import Field from 'src/components/Field';
import TextArea from 'src/components/TextArea';
import {
    openSharePopup
} from 'src/actions/catalog';

class ShareProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: this.props.product.id,
            invitee: [{ name: "", email: "" }],
            customer_name: this.props.currentUser.firstname + ' ' + this.props.currentUser.lastname,
            customer_email: this.props.currentUser.email
        };
    }



    render() {
        let { invitee } = this.state;
        const user = this.props.currentUser;
        const fullName = user.firstname + ' ' + user.lastname;
        const customer = {
            customer_name: fullName,
            customer_email: user.email
        }
        const { shareForm, senderFields, senderInfo, inviteeItems, inviteeItem, actions } = defaultClasses;
        return (
            <Form
                onSubmit={this.handleSubmit}
                initialValues={customer}
            >
                <div className={shareForm}>
                    <h2>{'Email to a Friend'}</h2>
                    <div className={senderFields}>
                        <h4> {'Sender'}</h4>
                        <div className={senderInfo}>
                            <Input
                                label="Name"
                                field="customer_name"
                                required
                            />
                            <Input
                                label="Email"
                                field="customer_email"
                                required
                            />
                        </div>
                        <Field required={true} label="Message">
                            <TextArea
                                field="message"
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                    <div className={inviteeItems}>
                        <h4> {'Invitee'}</h4>
                        {
                            invitee.map((val, idx) => {
                                let inviteeId = `invitee[${idx}].name`, emailId = `invitee[${idx}].email`
                                return (
                                    <div className={inviteeItem} key={idx}>
                                        <Input
                                            label="Name"
                                            field={inviteeId}
                                            data-id={idx}
                                            required
                                        />
                                        <Input
                                            label="Email"
                                            field={emailId}
                                            data-id={idx}
                                            required
                                        />
                                    </div>
                                )
                            })
                        }
                        <Button type="button" priority="high" onClick={this.addNewInvitee}>
                            {'+ Add Invitee'}
                        </Button>
                    </div>
                </div>
                <div className={actions}>
                    <Button type="submit" priority="high">
                        {'Send Email'}
                    </Button>
                </div>
            </Form>
        );
    };

    addNewInvitee = () => {
        this.setState((prevState) => ({
            invitee: [...prevState.invitee, { name: "", email: "" }],
        }));
    };
    handleSubmit = value => {
        value.item = this.state.item;
        this.hidePopup();
        this.props.sendEmailToFriend(value);
    };
    hidePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openSharePopup(false);
        bodyClasses.remove(modalIsOpen)
    }
}

const mapStateToProps = ({ user }) => {
    const { currentUser } = user;
    return {
        currentUser
    };
};

const mapDispatchToProps = {
    sendEmailToFriend,
    openSharePopup
};

export default compose(
    withApollo,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    //classify(defaultClasses)
)(ShareProduct);