import {
  LOAD_COMPANY, SAVED_COMPANY
} from "./actions";

const initState = {
    title: null,
    show: false,
    id: null,
    name: null,
    email: null,
    phone: null,
    avatar: null,
    password: null,
    confirmation_password: null
};

const companyForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_COMPANY: {
      return {
        ...state,
        ...action.form,
        title: !action.form.id ? 'Create Company' : 'Edit Company',
        show: true,
      }
    }
    case SAVED_COMPANY: {
      return {
        ...state,
        ...action.form,
        show: false,
      }
    }
    default: {
      return state;
    }
  }
};

export default companyForm;