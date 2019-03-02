import {SessionStorage} from "./index";
import * as R from "ramda";

export class Auth {
  static isAuthorised() {
    return R.pathOr(false, ['token'], SessionStorage.getItem('session'));
  }
}