import { useEmEffect } from './hooks/useEmEffect';
import { useStore } from './hooks/useStore';
import { useSelector } from './hooks/useSelector';
import { useSelectorByActions } from './hooks/useSelectorByActions';
import { createStore } from './store';
import { Provider } from './components/provider';
export * from './typeHelper';

export {
  Provider,
  useStore,
  useSelector,
  useSelectorByActions,
  useEmEffect,
  createStore,
};

export type Data<T> = {
  loading?: boolean;
  data?: T;
  error?: string;
};
