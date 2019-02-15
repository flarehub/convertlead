import {CHANGE_DEAL, LOAD_DEAL, SAVED_DEAL} from "./actions";

const initState = {
  show: false,
  title: '',
  id: '',
  name: '',
  companyId: '',
};

const dealForm = (state = initState, action) => {
  switch (action.type) {
    case LOAD_DEAL: {
      return {
        ...action.form,
        title: !action.form.id ? 'Create Deal' : 'Edit Deal',
      }
    }
    case SAVED_DEAL: {
      return {
        ...state,
        ...action.form,
        show: false,
      }
    }
    case CHANGE_DEAL: {
      return {
        ...state,
        ...action.form,
      }
    }
    default: {
      return state;
    }
  }
};

export default dealForm;