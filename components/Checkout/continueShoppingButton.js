import React, { Component } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import LockIcon from 'react-feather/dist/icons/lock';

const isDisabled = (busy, valid) => busy || !valid;

class ContinueShoppingButton extends Component {
    static propTypes = {
        ready: bool.isRequired,
        submit: func,
        submitting: bool
    };

    render() {
        const { ready, submit, submitting } = this.props;
        const disabled = isDisabled(submitting, ready);

        return (
            <Button disabled={disabled} onClick={submit}>
                <Icon src={LockIcon} size={16} />
                <span>Continue Shopping</span>
            </Button>
        );
    }
}

export default ContinueShoppingButton;
