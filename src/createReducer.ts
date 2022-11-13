import { createAction } from './createAction';
import {
  Slice,
  ReducerMetods,
  SliceOptions,
  EffectHandlers,
} from './typeHelper';

import { store } from './store';

/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "state name", and also it can have an object full of effect handlers, and automatically generates
 * action creators and action types that correspond to the
 * reducers and state and effects.
 *
 */
export function createReducer<
  State,
  CR extends ReducerMetods<State>,
  M extends EffectHandlers,
  Name extends string = string
>(options: SliceOptions<State, CR, M, Name>): Slice<State, CR, M, Name> {
  if (!options.name) {
    throw new Error('`name` is a required option for reducer');
  }

  const reducers: any = options.reducers || {};
  const actions: any = {};
  const effects: any = options.effects || {};
  const actionRegx = new RegExp(
    `^${options.name}.+(?:request|success|failure)$`,
    'i'
  );
  function reducer(state: any = options.initialState, action: any) {
    if (typeof reducers[action.type] === 'function') {
      return reducers[action.type](state, action);
    } else if (actionRegx.test(action.type)) {
      return { ...state, [action.key]: action.data };
    }
    return state;
  }

  Object.keys(reducers).map((key) => {
    const mkey = `${options.name}_${key}`;
    reducers[mkey] = reducers[key];
    reducers[key] = undefined;
    actions[key] = createAction(mkey);
  });
  const resolveEffect =
    (effectKey: string, state: () => any) => (key: string, apiData: any) => {
      const currentData = state()[options.name][key].data;
      store.dispatch({
        type: `${options.name}_${effectKey}_request`,
        key,
        data: { loading: true, data: currentData, error: null },
      });
      Promise.resolve(apiData)
        .then((data) =>
          store.dispatch({
            type: `${options.name}_${effectKey}_success`,
            key,
            data: { loading: false, data, error: null },
          })
        )
        .catch((err) =>
          store.dispatch({
            type: `${options.name}_${effectKey}_failure`,
            key,
            data: {
              loading: false,
              data: currentData,
              error: err.message ? err.message : err,
            },
          })
        );
    };
  Object.keys(effects).map((key) => {
    const handler = effects[key];
    actions[key] = (payload: any) =>
      store.dispatch(() =>
        handler(
          { payload },
          resolveEffect(key, store.getState),
          store.getState,
          store.dispatch
        )
      );
  });
  store.addReducer(options.name, reducer, options.initialState);
  return {
    name: options.name,
    actions,
    //reducer,
  };
}
