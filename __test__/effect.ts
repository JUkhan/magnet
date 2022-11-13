import { createEffect } from '../src';
import { increment } from './counterState';

createEffect(increment, (action, getState, dispatch) => {
  console.log(dispatch, getState(), action, '--------');
});
