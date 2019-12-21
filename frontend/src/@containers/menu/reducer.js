import Companies from 'components/companies';
import Dashboard from 'components/dashboard';
import Leads from 'components/leads';
import Agents from 'components/agents';
import Users from 'components/users';
import { GET_USER_MENU } from './actions';

const initialState = {
  sideBarMenu: [
    {
      icon: 'icon-home1',
      name: 'Campaigns',
      path: '/dashboard',
      component: Dashboard,
      role: ['agency', 'company', 'agent'],
    },
    {
      icon: 'icon-home1',
      name: 'Users',
      path: '/users',
      component: Users,
      role: ['admin'],
    },
    {
      icon: 'icon-clients',
      name: 'Companies',
      path: '/companies',
      component: Companies,
      role: ['agency'],
    },
    {
      icon: 'icon-leads',
      name: 'Leads',
      path: '/leads',
      component: Leads,
      role: ['agency', 'company'],
    },
    {
      icon: 'icon-leads',
      name: 'Leads',
      path: '/companies/leads/all',
      component: Leads,
      role: ['agent'],
    },
    {
      icon: 'icon-agents',
      name: 'Agents',
      path: '/agents',
      component: Agents,
      role: ['agency', 'company'],
    },
    {
      icon: 'chart line',
      name: 'Stats',
      path: '/stats',
      component: Agents,
      role: ['company'],
    },
  ],
  visibleMenus: [],
};

function menu(state = initialState, action) {
  switch (action.type) {
    case GET_USER_MENU: {
      const role = action.role.toLowerCase();
      const userMenus = state.sideBarMenu
        .filter(menu => menu.role.indexOf(role) !== -1);
      return {
        ...state,
        visibleMenus: userMenus,
      };
    }
    default: {
      return state;
    }
  }
}

export default menu;
