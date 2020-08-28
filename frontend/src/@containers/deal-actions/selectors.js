import { createSelector } from 'reselect';
import * as R from 'ramda';

export const getMappedActions = createSelector(
  state => state.dealActions.actions,
  (actions) => {

    const rootActions = R.filter((action) => action.is_root, actions);
    const children = R.filter((action) => !action.is_root, actions);

    const getChildren = (child, action) => {
      const childElement = R.find(actionFind => actionFind.parent_id === child.id, children);

      if (childElement) {
        if (action.children) {
          action.children = [
            ...action.children,
            {
              ...childElement,
              index: action.children.length + 1,
            },
          ];
        } else {
          action.children = [{
            ...childElement,
            index: 1,
          }];
        }

        if (childElement.parent_id) {
          getChildren(childElement, action)
        }
      }
      return action;
    }
    let index = 0;
    return R.map((action) => {
      return {
        ...getChildren(action, action),
        index: index++,
      };
    }, Object.values(rootActions));
  }
)
