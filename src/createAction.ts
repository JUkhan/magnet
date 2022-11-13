import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from './typeHelper';
import { store } from './store';

export function createAction<P = void, T extends string = string>(
  type: string
): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T> {
  const fx = (payload?: P): any => store.dispatch({ type, payload: payload });
  fx._$atype = type;
  return fx;
}
/*export function createAction(store: any) {
  return function createActionHelper<P = void, T extends string = string>(
    type: string
  ): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T> {
    const fx = (payload?: P): any => store.dispatch({ type, payload: payload });
    fx._$atype = type;
    return fx;
  };
}*/
