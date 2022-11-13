import { useEmEffect } from './hooks/useEmEffect';
import { useStore } from './hooks/useStore';
import { useSelector } from './hooks/useSelector';

import { createStore } from './store';
import { Provider } from './components/provider';
export * from './typeHelper';

export { Provider, useStore, useSelector, useEmEffect, createStore };

export type Data<T> = {
  loading?: boolean;
  data?: T;
  error?: string;
};
