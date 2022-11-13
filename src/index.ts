import { useStore } from './selector';
import { createReducer } from './createReducer';
export * from './typeHelper';
import { useEmEffect, createEffect, on } from './effect';
import { createAction } from './createAction';

export { useStore, createReducer, useEmEffect, createAction, createEffect, on };
export type Data<T> = {
  loading?: boolean;
  data?: T;
  error?: string;
};
