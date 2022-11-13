import { EffectHandler2 as EffectHandler } from '../typeHelper';

export function subscribeEffect(
  actionTypes: string[],
  callback: EffectHandler,
  effectMap: Map<string, any>
) {
  let key = Number(new Date()).toString() + Math.random();
  let notifyCallback = (dispatch: any, getData: any, action: any) => {
    if (actionTypes.includes(action.type)) {
      callback(action, getData, dispatch);
    }
  };
  effectMap.set(key, notifyCallback);

  return {
    unsubscribe: () => {
      effectMap.delete(key);
    },
  };
}
