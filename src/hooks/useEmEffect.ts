import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';
import {
  EffectHandler2 as EffectHandler,
  ActionParam,
  ActionFn,
} from '../typeHelper';
import { useStore } from './useStore';
import { subscribeEffect } from '../utils/subscribeEffect';

/**
 * A hook that allows you to manage side effects in your component based on the action/s.
 * And it will automatically unsubscribe when the component unmounts.
 * @param actions An array of action functions or a single action function - `generated from createAction()`.
 * @param handlerFn A function that accepts the dispatch, getState and action.
 */
export function useEmEffect(actions: ActionParam, handlerFn: EffectHandler) {
  const store = useStore();
  useIsomorphicLayoutEffect(() => {
    let _actions: ActionFn[] = Array.isArray(actions) ? actions : [actions];
    const sub = subscribeEffect(
      _actions.map((actionFn: any) => actionFn._$atype),
      handlerFn,
      store.__effectMap
    );
    return () => {
      sub.unsubscribe();
    };
  }, []);
}
