import {SessionStorage} from "./index";
import * as R from "ramda";

export class Auth {
  static isAuthorised() {
    return R.pathOr(false, ['token'], SessionStorage.getItem('session'));
  }

  static get role() {
    return R.pathOr('', ['user', 'role'], SessionStorage.getItem('session')).toLowerCase();
  }

  static get user() {
    return R.pathOr({}, ['user'], SessionStorage.getItem('session'));
  }
}