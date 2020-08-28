import {api} from "@services";
import {fetchDealActionsSuccess} from "./actions";
import {sendMessage} from "../messages/thunks";

export const fetchDealAction = (dealId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/v1/company/deals/${dealId}/actions`);
    dispatch(fetchDealActionsSuccess(data));
  } catch (e) {
    sendMessage(e.message, true);
  }
}
