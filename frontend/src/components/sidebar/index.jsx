import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Icon, Menu, Sidebar } from 'semantic-ui-react'
import PropTypes  from 'prop-types';
import AppMenu from "@containers/menu";
class AppSidebar extends Component {
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
      </Sidebar>
		)
	}
}

AppSidebar.propTypes = {
  visibleMenus: PropTypes.array.isRequired
};

export default AppMenu(AppSidebar);