import {LOAD_TIMELINE_LEAD} from "./actions";

const initState = {
  lead: {
    campaign: {},
    company: {},
    agent: {},
  },
  leadNotes: [],
};

const leadNotes = (state = initState, action) => {
  switch (action.type) {
    case LOAD_TIMELINE_LEAD: {
      return {
        ...state,
        lead: action.lead,
        leadNotes: action.lead.lead_notes
      }
    }
    default: {
      return state;
    }
  }
};

export default leadNotes;