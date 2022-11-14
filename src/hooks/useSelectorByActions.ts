import { useState } from 'react';
import { ActionParam } from '../typeHelper';
import { useEmEffect } from './useEmEffect';
import { useStore } from './useStore';
import { shallowEqual } from '../utils/shallowEqual';

export function useSelectorByActions<T = any>(
  acions: ActionParam,
  selector: (state: any) => T,
  equalityFn: (left: T, right: T) => boolean = shallowEqual
) {
  const store = useStore();
  const [selectedState, setState] = useState(selector(store.getState()));
  let oldState = selectedState;
  useEmEffect(acions, () => {
    const newState = selector(store.getState());
    if (!equalityFn(newState, oldState)) {
      setState(newState);
      oldState = newState;
    }
  });

  return selectedState;
}
