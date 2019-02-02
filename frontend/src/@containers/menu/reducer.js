import { GET_USER_MENU } from './actions';
import Companies from "components/companies";
import Dashboard from "components/dashboard";
import Leads from "components/leads";
import Agents from "components/agents";

const initialState = {
  sideBarMenu: [
    {
      icon: 'home',
      name: 'Dashboard',
      path: '/dashboard',
      component: Dashboard,
      role: [ 'agency', 'company', 'agent']
    },
    {
      icon: 'address card outline',
      name: 'Companies',
      path: '/companies',
      component: Companies,
      role: ['agency']
    },
    {
      icon: 'address book',
      name: 'Leads',
      path: '/leads',
      component: Leads,
      role: ['agency', 'company']
    },
    {
      icon: 'user secret',
      name: 'Agents',
      path: '/agents',
      component: Agents,
      role: ['agency', 'company']
    }
  ],
  visibleMenus: []
};

function menu(state = initialState, action) {
  switch (action.type)  {
    case GET_USER_MENU: {
      const role = action.role.toLowerCase();
      const userMenus = state.sideBarMenu
      .filter(menu => {
        return menu.role.indexOf(role) !== -1;
      });
      return {
        ...state,
        visibleMenus: userMenus,
      };
    }
    default: {
      return state
    }
  }
}

export default menu;