import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import classify from 'src/classify';
import Truncate from 'src/components/Truncate';
import defaultClasses from './ShowMoreText.css';

class ShowMoreText extends Component {

    static defaultProps = {
        lines: 3,
        more: 'Show more',
        less: 'Show less',
        anchorClass: '',
        onClick: undefined,
        expanded: false
    }

    static propTypes = {
        children: PropTypes.node,
        lines: PropTypes.number,
        more: PropTypes.node,
        less: PropTypes.node,
        anchorClass: PropTypes.string,
        onClick: PropTypes.func,
        expanded: PropTypes.bool
    }

    componentDidMount() {
        var _self = this;
        this.setState({
            expanded: _self.props.expanded
        });
    }

    state = {
        expanded: false,
        truncated: false
    }

    handleTruncate = truncated => {
        if (truncated !== this.state.truncated) {
            this.setState({
                truncated
            });
        }
    }

    toggleLines = event => {
        event.preventDefault();
        var _self = this;
        this.setState({
            expanded: !this.state.expanded
        }, () => {
            if (_self.props.onClick) {
                _self.props.onClick(_self.state.expanded);
            }
        });
    }

    render() {
        const {
            children,
            more,
            less,
            lines,
            anchorClass
        } = this.props;

        const {
            expanded,
            truncated
        } = this.state;
        const {  anchorClassCustom } = defaultClasses;
        return (
            <div>
                <Truncate
                    lines={!expanded && lines}
                    ellipsis={(
                        <a href='#' className={anchorClassCustom} onClick={this.toggleLines}>{more}</a>
                    )}
                    onTruncate={this.handleTruncate}
                >
                    {children}
                </Truncate>
                {!truncated && expanded && (
                    <a href='#' className={anchorClassCustom} onClick={this.toggleLines}>{less}</a>
                )}
            </div>
        );
    }
}

export default classify({defaultClasses})(ShowMoreText);