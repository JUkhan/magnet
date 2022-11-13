import { createReducer, PayloadAction, on, Data } from '../src';

export const complexState = createReducer({
  name: 'complex',
  initialState: { emp: {} as Data<number[]> },
  reducers: {},

  effects: {
    loadData(action: PayloadAction<void>, put) {
      put('emp', api());
    },
    loadErrorData(action: PayloadAction<void>, put) {
      put('emp', apiError());
    },
    add(action: PayloadAction<number>, put, getState) {
      const data = getState().complex.emp.data ?? [];
      data.push(action.payload);
      put('emp', data);
    },
  },
});
function api() {
  return new Promise((resolve) => setTimeout(() => resolve([1, 3, 5]), 100));
}
function apiError() {
  return new Promise((resolve, reject) =>
    setTimeout(() => reject(Error('internal server error')), 100)
  );
}
export const { loadData, loadErrorData, add } = complexState.actions;
