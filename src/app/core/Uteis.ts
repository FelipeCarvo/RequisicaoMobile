import { Store } from "@ngxs/store";
import { ResetStateReq } from "./store/actions/req.actions";
import { ResetStateInsumos } from "./store/actions/insumos.actions";
import { Logout } from "./store/actions/auth.actions";

export class Uteis {
  static ZerarLogin(store: Store) {
    store.dispatch(new ResetStateReq());
    store.dispatch(new ResetStateInsumos());
    store.dispatch(new Logout());
  }
}
