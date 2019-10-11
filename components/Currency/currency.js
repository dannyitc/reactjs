import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './currency.css';

class Currency extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      switcherOptions: PropTypes.string,
      switcherDropdown: PropTypes.string,
      switcherOption: PropTypes.string,
    })

  };

  constructor() {
    super();

    this.state = {
      showMenu: false,
    };
  }

  showMenu = () => {
    const { showMenu } = this.state;

    this.setState({
      showMenu: !showMenu
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.switcherOptions}>
        <button onClick={this.showMenu}>
          <strong>
            <span>GBP</span>
          </strong>
        </button>

        {
          this.state.showMenu &&
          <ul className={classes.switcherDropdown}
            ref={(element) => {
              this.dropdownMenu = element;
            }}
          >
            <li className={classes.switcherOption}>
              <a href="#">EUR - Euro</a>
            </li>
            <li className={classes.switcherOption}>
              <a href="#">USD - US Dollar</a>
            </li>
          </ul>

        }
      </div>
    );
  }
}
export default classify(defaultClasses)(Currency);