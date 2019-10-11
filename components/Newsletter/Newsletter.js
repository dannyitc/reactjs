import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import Input from 'src/components/Input';
import Button from 'src/components/Button';
import classify from 'src/classify';
import defaultClasses from './Newsletter.css';

class Newsletter extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            form: PropTypes.string,
            buttonContainer: PropTypes.string,
            formFotter: PropTypes.string,
        })
        
    };

    static defaultProps = {
        initialValues: {}
    };

    render() {
        const { classes } = this.props;
        const customClass = this.props.customClass == 'footerNewsletter' ? classes.formFotter : classes.form; 
        const iconInput   = this.props.customClass == 'footerNewsletter' ? 'true' : 'false';
        return (
            <Form className={customClass}>
                <Input
                    autoComplete="email"
                    placeholder="Email Address"
                    field="email"
                    disableLabel="true"
                    disableIcon={iconInput}
                />
                <div className={classes.buttonContainer}>
                    <Button type="submit" priority="high">
                    Subscribe
                    </Button>
                </div>
            </Form>
        );
    }
}

export default classify(defaultClasses)(Newsletter);
