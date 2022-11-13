import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect';
import {
  EffectHandler2 as EffectHandler,
  ActionParam,
  ActionFn,
} from './typeHelper';
import { store } from './store';
/**
 * Orbit is a redux middleware that allows you to subscribe to effects based on action, and
 * it also works like a redux-thunk for the effects inside the creatReducer() function.
 *
 */

function subscribeEffect(actionTypes: string[], callback: EffectHandler) {
  let key = Number(new Date()).toString() + Math.random();
  let notifyCallback = (dispatch: any, getData: any, action: any) => {
    if (actionTypes.includes(action.type)) {
      callback(action, getData, dispatch);
    }
  };
  store.effectMap.set(key, notifyCallback);

  return {
    unsubscribe: () => {
      store.effectMap.delete(key);
    },
  };
}

/**
 * A hook that allows you to manage side effects in your component based on the action/s.
 * And it will automatically unsubscribe when the component unmounts.
 * @param actions An array of action functions or a single action function - `generated from createAction()`.
 * @param handlerFn A function that accepts the dispatch, getState and action.
 */
export function useEmEffect(actions: ActionParam, handlerFn: EffectHandler) {
  useIsomorphicLayoutEffect(() => {
    let _actions: ActionFn[] = Array.isArray(actions) ? actions : [actions];
    const sub = subscribeEffect(
      _actions.map((actionFn: any) => actionFn._$atype),
      handlerFn
    );
    return () => {
      sub.unsubscribe();
    };
  }, []);
}
function debounce(func: any, timeout = 300) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * A function that allows you to manage side effects from outside of the components.
 * @param actions An array of action functions or a single action function - `generated from createAction()`.
 * @param handlerFn A function that accepts the dispatch, getState and action.
 * @returns cleanup function
 */
export function createEffect(actions: ActionParam, handlerFn: EffectHandler) {
  let _actions: ActionFn[] = Array.isArray(actions) ? actions : [actions];
  const sub = subscribeEffect(
    _actions.map((actionFn: any) => actionFn._$atype),
    handlerFn
  );
  return sub;
}

export function on(...actions: ActionFn[]) {
  let _actions: string[] = actions.map((actionFn: any) => actionFn._$atype);

  return {
    debounce(milliseconds: number) {
      return {
        effect(handlerFn: EffectHandler) {
          return subscribeEffect(_actions, debounce(handlerFn, milliseconds));
        },
      };
    },
    effect(handlerFn: EffectHandler) {
      return subscribeEffect(_actions, handlerFn);
    },
  };
}
