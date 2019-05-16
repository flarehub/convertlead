import Companies from 'components/companies';
import Dashboard from 'components/dashboard';
import Leads from 'components/leads';
import Agents from 'components/agents';
import { GET_USER_MENU } from './actions';

const initialState = {
  sideBarMenu: [
    {
      icon: 'icon-home1',
      name: 'Home',
      path: '/dashboard',
      component: Dashboard,
      role: ['agency', 'company', 'agent'],
    },
    {
      icon: 'icon-clients',
      name: 'Clients',
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
