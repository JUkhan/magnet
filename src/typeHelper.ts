//import { Action, AnyAction } from 'redux';
export interface Action {
  type: any;
}
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S;

export type ReducerMetods<State> = {
  [K: string]: Reducer<State, PayloadAction<any>>;
};
export type ValidateReducers<S, ACR extends ReducerMetods<S>> = ACR & {
  [T in keyof ACR]: ACR[T] extends {
    reducer(s: S, action?: infer A): any;
  }
    ? {
        prepare(...a: never[]): Omit<A, 'type'>;
      }
    : {};
};

export type EffectHandlers = {
  [K: string]: EffectHandler<PayloadAction<any>>;
};

export type ValidateEffects<ACR extends EffectHandlers> = ACR & {
  [T in keyof ACR]: ACR[T] extends {
    handler(
      action?: infer A,
      put?: (key: string, data: any) => void,
      getState?: () => any,
      dispatch?: (action: AnyAction) => void
    ): void;
  }
    ? {
        prepare(...a: never[]): Omit<A, 'type'>;
      }
    : {};
};

export declare type PayloadAction<P = void, T extends string = string> = {
  payload: P;
  type: T;
};

export interface ActionCreatorWithoutPayload<T extends string = string> {
  /**
   * Calling this {@link redux#ActionCreator} will
   * return a {@link PayloadAction} of type `T` with a payload of `undefined`
   */
  (): PayloadAction<undefined, T>;
}

export interface ActionCreatorWithPayload<P, T extends string = string> {
  /**
   * Calling this {@link redux#ActionCreator} with an argument will
   * return a {@link PayloadAction} of type `T` with a payload of `P`
   */
  (payload: P): PayloadAction<P, T>;
}
type ActionCreatorForReducer<R> = R extends (
  state: any,
  action: infer Action
) => any
  ? Action extends { payload: infer P }
    ? ActionCreatorWithPayload<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload;

export type ReducerActions<Reducers extends ReducerMetods<any>> = {
  [Type in keyof Reducers]: ActionCreatorForReducer<Reducers[Type]>;
};

export type EfffectOptioons = {
  [key: string]: EffectHandler;
};
export interface SliceOptions<
  State = unknown,
  R extends ReducerMetods<State> = ReducerMetods<State>,
  M extends EffectHandlers = EffectHandlers,
  Name extends string = string
> {
  name: Name;
  initialState: State;
  reducers: ValidateReducers<State, R>;
  effects?: ValidateEffects<M>;
}
export interface Slice<
  State = unknown,
  R extends ReducerMetods<State> = ReducerMetods<State>,
  M extends EffectHandlers = EffectHandlers,
  Name extends string = string
> {
  name: Name;
  actions: ReducerActions<R> & EffectActions<M>;
  //reducer: Reducer<State, AnyAction>;
}

export type EffectHandler<A extends Action = AnyAction> = (
  action: A,
  put: (key: string, data: any) => void,
  getState: () => any,
  dispatch: (action: AnyAction) => void
) => void;

export type EffectHandler2<A extends Action = AnyAction> = (
  action: A,
  getState: () => any,
  dispatch: (action: AnyAction) => void
) => void;

type ActionCreatorForEffect<R> = R extends (
  action: infer Action,
  put: (key: string, data: any) => void,
  getState: () => any,
  dispatch: (action: AnyAction) => void
) => any
  ? Action extends { payload: infer P }
    ? ActionCreatorWithPayload<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload;

export type EffectActions<Reducers extends EffectHandlers> = {
  [Type in keyof Reducers]: ActionCreatorForEffect<Reducers[Type]>;
};

export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};
declare const $CombinedState: unique symbol;

interface EmptyObject {
  readonly [$CombinedState]?: undefined;
}
export type CombinedState<S> = EmptyObject & S;

export type ActionFn = (...args: any[]) => Action;
export type ActionParam = ActionFn | ActionFn[];

export interface TypedUseSelectorByActionsHook<TState> {
  <TSelected>(
    actions: ActionParam,
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
  ): TSelected;
}
export type Store<T extends Object = any> = {
  dispatch(action: AnyAction): void;
  getState: () => T;
  //dispose: () => void;
  createAction<P = void, T extends string = string>(
    type: string
  ): ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<P, T>;
  createReducer<
    State,
    CR extends ReducerMetods<State>,
    M extends EffectHandlers,
    Name extends string = string
  >(
    options: SliceOptions<State, CR, M, Name>
  ): Slice<State, CR, M, Name>;
  on(...actions: ActionFn[]): {
    debounce(milliseconds: number): {
      effect(handlerFn: EffectHandler2): {
        unsubscribe: () => void;
      };
    };
    effect(handlerFn: EffectHandler2): {
      unsubscribe: () => void;
    };
  };
  createEffect(
    actions: ActionParam,
    handlerFn: EffectHandler2
  ): {
    unsubscribe: () => void;
  };
  subscribe(fn: any): () => void;
  ///__effectMap: Map<string, any>;
  [key: string]: any;
};
