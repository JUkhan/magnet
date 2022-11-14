import { useState } from 'react';
import { shallowEqual } from '../utils/shallowEqual';
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';
import { useStore } from './useStore';

export function useSelector<T = any>(
  selector: (sate: any) => T = (state) => state as T,
  equalityFn: (left: T, right: T) => boolean = shallowEqual
) {
  const store = useStore();
  const [state, setState] = useState(selector(store.getState()));
  let oldState: any = null;
  useIsomorphicLayoutEffect(() => {
    return store.subscribe((mState) => {
      const newState = selector(mState);
      if (!equalityFn(newState, oldState)) {
        setState(newState);
        oldState = newState;
      }
    });
  }, [store]);
  return state;
}
