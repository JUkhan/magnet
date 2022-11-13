function createStore<T = any>(initialState: T) {
  const listenerList = new Set<(item: any) => any>();
  let state = initialState;
  const reducers = new Map<string, (state: any, action: any) => any>();
  const effectMap = new Map<string, any>();
  const obj = {
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
        this.setState(key, keyState);
      });
      effectMap.forEach((cal) => cal(this.dispatch, this.getState, action));
    },
    addReducer(name: string, reducer: any, init: any) {
      reducers.set(name, reducer);
      this.setState(name, init);
    },
    effectMap,
  };
  return obj;
}
export const store = createStore({});
