import { createSelector } from 'reselect';
import * as R from 'ramda';

export const getMappedActions = createSelector(
  state => state.dealActions.actions,
  (actions) => {
    const actionsResult = R.reduce((acc, action) => {
      if (action.is_root) {
        if (action.parent_id) {
          acc[action.parent_id] = {
            ...R.pathOr({}, [action.parent_id], acc),
            verticalActions: [...R.pathOr([], [action.parent_id, 'verticalActions'], acc), action]
          };
        } else {
          acc[action.id] = {
            ...action,
            ...R.pathOr({}, [action.id], acc),
          };
        }
      } else if (action.parent_id) {
        acc[action.parent_id] = {
          horizontalActions: [...R.pathOr([], ['horizontalActions', action.parent_id], acc), action]
        }
      }

      return acc;
    }, {}, actions);

    return Object.values(actionsResult);
  }
)
