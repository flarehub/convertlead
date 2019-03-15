import React, { Component } from 'react'
import { compose } from 'recompose';
import { Link } from 'react-router-dom'
import { MenuContainer, AuthContainer } from "@containers";
import PropTypes  from 'prop-types';

import { Icon, Menu, Image } from 'semantic-ui-react'
import logo from '../assets/logo.png';
import './index.scss';
import {Auth} from "@services";

class AppSidebar extends Component {

  logout = () => {
    this.props.logout();
  }

  componentWillMount() {
    this.props.getUserSideBarMenu(Auth.role);
  }

	render() {
	  const { visibleMenus } = this.props;
		return (
      <Menu className='AppSidebar' fixed='left' vertical={true} icon={true}>
        <Menu.Item className='app-logo'>
          <Image src={logo} />
        </Menu.Item>
        {
          visibleMenus.map((menu, i) => (
            <Link to={menu.path} key={i}>
              <Menu.Item index={i}>
                <i className={menu.icon} />
                <div>{menu.name}</div>
              </Menu.Item>
            </Link>
          ))
        }
        <div className='user-avatar'>
          <Link to='/profile'>
            <Menu.Item>
              <Icon name='user circle outline' />
              <label>Profile</label>
            </Menu.Item>
          </Link>
          <Menu.Item onClick={this.logout}>
            <Icon name='log out'/>
            <label>Logout</label>
          </Menu.Item>
        </div>
      </Menu>
		)
	}
}

AppSidebar.propTypes = {
  visibleMenus: PropTypes.array.isRequired
};

export default compose(MenuContainer, AuthContainer)(AppSidebar);

