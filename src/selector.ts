import { useSyncExternalStore } from 'react';
import { store } from './store';
import { shallowEqual } from './utils/shallowEqual';

export function useStore<T>(
  selector: (sate: any) => T = (state) => state as T,
  cache = false
) {
  let oldState: any = null;
  return useSyncExternalStore<T>(store.subscribe, () => {
    if (cache) {
      const newState = selector(store.getState());
      if (!shallowEqual(oldState, newState)) {
        oldState = newState;
      }
      return oldState;
    }
    return selector(store.getState());
  });
}
