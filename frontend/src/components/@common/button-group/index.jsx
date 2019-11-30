import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

// eslint-disable-next-line react/prefer-stateless-function
export default class ButtonGroup extends Component {
  state = {
    isActive: false,
  };

  handleOnClick = () => {
    this.setState((prevState) => ({ isActive: !prevState.isActive }));
  };

  render() {
    const { className } = this.props;
    const { isActive } = this.state;
    return (
      <Button.Group className={`custom-buttons ${(className || '')} ${(isActive ? 'active' : '')}`} onClick={this.handleOnClick}>
        { this.props.children }
      </Button.Group>
    );
  }
}
