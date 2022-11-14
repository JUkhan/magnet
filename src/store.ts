import { createAction } from './createAction';
import { createReducer } from './createReducer';
import { createEffectHelper, onHelper } from './effect';
import { Store } from './typeHelper';

function createStoreHelper<T extends object = any>(initialState: T): Store<T> {
  const listenerList = new Set<(item: any, action: any) => any>();
  let state: any = initialState;
  const reducers = new Map<string, (state: any, action: any) => any>();
  const effectMap = new Map<string, any>();

  function notifyAll(action?: any) {
    listenerList.forEach((listener) => listener(state, action));
  }
  const obj = {
    getState() {
      return state;
    },
    subscribe(listener: (state: any, action: any) => any) {
      listenerList.add(listener);
      return () => listenerList.delete(listener);
    },
    dispatch(action: any) {
      if (typeof action === 'function') {
        action();
        return;
      }
      let stateChanged = false;
      reducers.forEach((reduce, key) => {
        const oldState = state[key];
        const newState = reduce(oldState, action);
        if (newState !== oldState) {
          state[key] = newState;
          stateChanged = true;
        }
      });
      if (stateChanged) {
        state = Object.assign({}, state);
        notifyAll(action);
      }
      effectMap.forEach((cal) => cal(obj.dispatch, obj.getState, action));
    },
    addReducer(name: string, reducer: any, init: any) {
      reducers.set(name, reducer);
      state = { ...state, [name]: init };
      notifyAll();
    },

    dispose() {},
    createAction,
  };

  return {
    getState: obj.getState,
    dispose: obj.dispose,
    createAction: obj.createAction,
    createReducer: createReducer(obj),
    on: onHelper(effectMap) as any,
    createEffect: createEffectHelper(effectMap) as any,
    subscribe: obj.subscribe,
    __effectMap: effectMap,
    dispatch: obj.dispatch,
  };
}
export function createStore<T extends object = any>() {
  return createStoreHelper<T>({} as any);
}
