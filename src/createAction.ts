import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
} from './typeHelper';

export function createAction<P = void, T extends string = string>(
  type: string
): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T> {
  //@ts-ignore
  const fx = (payload?: P): any => this.dispatch({ type, payload: payload });
  fx._$atype = type;
  return fx;
}
