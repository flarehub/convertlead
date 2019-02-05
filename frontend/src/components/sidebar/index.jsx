import React, { Component } from 'react'
import { compose } from 'recompose';
import { Link } from 'react-router-dom'

import { Icon, Menu, Sidebar, Dropdown } from 'semantic-ui-react'
import PropTypes  from 'prop-types';
import { MenuContainer, AuthContainer } from "@containers";
class AppSidebar extends Component {

  logout = () => {
    this.props.logout();
  }

  componentWillMount() {
    this.props.getUserSideBarMenu('agency');
  }

	render() {
	  const { visibleMenus } = this.props;
		return (
      <Sidebar
        as={Menu}
        animation='push'
        direction='left'
        icon='labeled'
        inverted
        vertical
        visible={true}
        width='thin'
      >
        {
          visibleMenus.map((menu, i) => (
            <Link to={menu.path} key={i}>
              <Menu.Item index={i}>
                <Icon name={menu.icon} />
                {menu.name}
              </Menu.Item>
            </Link>
          ))
        }
        <Menu.Item>
          <Dropdown text='My Acount'>
            <Dropdown.Menu>
              <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Sidebar>
		)
	}
}

AppSidebar.propTypes = {
  visibleMenus: PropTypes.array.isRequired
};

export default compose(MenuContainer, AuthContainer)(AppSidebar);