import React, { Component } from 'react'
import { compose } from 'recompose';
import { Link } from 'react-router-dom'
import { MenuContainer, AuthContainer, ProfileContainer } from "@containers";
import PropTypes  from 'prop-types';

import { Icon, Menu, Dropdown, Image } from 'semantic-ui-react'
import logo from './logo.png';
import styles from './index.scss';

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
      <Menu className={styles.AppSidebar} fixed='left' vertical={true} icon={true}>
        <Menu.Item className='app-logo'>
          <Image src={logo} />
        </Menu.Item>
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
       <Menu.Item className='user-avatar'>
          <Dropdown trigger={<Image avatar src={this.props.profile.avatar_path} size='tiny' />} pointing='top left' icon={null} >
            <Dropdown.Menu>
              <Dropdown.Item>My Profile</Dropdown.Item>
              <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu>
		)
	}
}

AppSidebar.propTypes = {
  visibleMenus: PropTypes.array.isRequired
};

export default compose(MenuContainer, ProfileContainer, AuthContainer)(AppSidebar);

