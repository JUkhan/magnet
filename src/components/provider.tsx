import React from 'react';
import { Store } from '../typeHelper';
import { MagneticContext } from './context';
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';

interface StoreProps {
  store: Store,
  context?: React.Context<Store<any>>,
  children?: any
}

export const Provider: React.FC<StoreProps> = ({ store, context, children }) => {
  useIsomorphicLayoutEffect(() => {
    return () => {
      store?.dispose();
    }
  }, [store]);
  const Context = context || MagneticContext
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
