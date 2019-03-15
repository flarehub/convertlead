import React, { Component } from 'react'
import { compose } from 'recompose';
import { Link } from 'react-router-dom'
import { MenuContainer, AuthContainer, ProfileContainer } from "@containers";
import PropTypes  from 'prop-types';

import { Menu, Image } from 'semantic-ui-react'
import logo from '../static/assets/logo.png';
import './index.scss';
import {Auth} from "@services";
import {AvatarImage} from "components/@common/image";

class AppSidebar extends Component {

  logout = () => {
    this.props.logout();
  }

  componentWillMount() {
    this.props.getUserSideBarMenu(Auth.role);
  }

	render() {
	  const { visibleMenus, profile } = this.props;
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
       <div className='sidebar-bootom'>
         <a href='http://support.digitalfollow.com' target='_blank'>
           <i className='icon-support' />
         </a>
         <Menu.Item onClick={this.logout}>
           <i className='icon-logoff'/>
         </Menu.Item>
         <Link to='/profile'>
           <AvatarImage src={profile.avatar_path} sidebar-avatar rounded size='tiny'  />
         </Link>
       </div>
      </Menu>
		)
	}
}

AppSidebar.propTypes = {
  visibleMenus: PropTypes.array.isRequired
};

export default compose(ProfileContainer, MenuContainer, AuthContainer)(AppSidebar);

