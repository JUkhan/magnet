import { store } from './store';
import { increment } from './counterState';

store.createEffect(increment, (action, getState, dispatch) => {
  console.log(dispatch, getState(), action, '--------');
});
