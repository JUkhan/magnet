import React from 'react';
import { Store } from '../typeHelper';
import { MagneticContext } from '../components/context';
import { useMagneticContext as useDefaultMonoContext } from './useStoreContext';

export function createStoreHook(context = MagneticContext) {
  const useMonoContext =
    context === MagneticContext
      ? useDefaultMonoContext
      : () => React.useContext<Store<any>>(context);
  return function useStore() {
    const store = useMonoContext();
    return store;
  };
}

export const useStore = createStoreHook();
