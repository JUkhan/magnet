import { createActionHelper } from './createAction';
import { createReducer } from './createReducer';
import { createEffectHelper, onHelper } from './effect';
import { Store } from './typeHelper';

function createStoreHelper<T extends object = any>(initialState: T): Store<T> {
  const listenerList = new Set<(item: any) => any>();
  let state = initialState;
  const reducers = new Map<string, (state: any, action: any) => any>();
  const effectMap = new Map<string, any>();
  const obj: any = {
    setState(key: string, value: any) {
      state = { ...state, [key]: value };
      listenerList.forEach((listener) => listener(state));
    },
    getState() {
      return state;
    },
    subscribe(listener: (state: any) => any) {
      listenerList.add(listener);
      return () => listenerList.delete(listener);
    },
    dispatch(action: any) {
      if (typeof action === 'function') {
        action();
        return;
      }
      reducers.forEach((reduce, key) => {
        /*@ts-ignore*/
        const keyState = reduce(state[key], action);
        obj.setState(key, keyState);
      });
      effectMap.forEach((cal) => cal(obj.dispatch, obj.getState, action));
    },
    addReducer(name: string, reducer: any, init: any) {
      reducers.set(name, reducer);
      obj.setState(name, init);
    },

    dispose() {
      effectMap.clear();
      reducers.clear();
      listenerList.clear();
    },
  };
  obj.createAction = createActionHelper(obj.dispatch);
  return {
    getState: obj.getState,
    dispose: obj.dispose,
    createAction: obj.createAction,
    createReducer: createReducer(obj),
    on: onHelper(effectMap) as any,
    createEffect: createEffectHelper(effectMap) as any,
    subscribe: obj.subscribe,
    __effectMap: effectMap,
  };
}
export function createStore<T extends object = any>() {
  return createStoreHelper<T>({} as any);
}
