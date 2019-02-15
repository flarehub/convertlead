import { LOAD_DEAL, SAVED_DEAL } from "./actions";

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
      console.log(state);
      return {
        ...state,
        ...action.form,
        title: !state.id ? 'Create Deal' : 'Edit Deal',
      }
    }
    case SAVED_DEAL: {
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

export default dealForm;