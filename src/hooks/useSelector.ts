import { useSyncExternalStore } from 'react';
import { shallowEqual } from '../utils/shallowEqual';
import { useStore } from './useStore';

export function useSelector<T>(
  selector: (sate: any) => T = (state) => state as T,
  cache = false
) {
  const store = useStore();
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
