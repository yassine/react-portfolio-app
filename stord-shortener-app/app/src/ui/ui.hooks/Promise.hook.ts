import { useEffect, useReducer } from 'react';
import pTimeout                           from 'p-timeout';

const DEFAULT_TIMEOUT = 3000;

export function usePromiseState(promise, config: PromiseStateConfig): PromiseHookState {
  const [ state, dispatch ] = useReducer(PromiseStateReducer, {} as PromiseHookState);
  useEffect(() => {
    if (promise && !state.active) {
      const timeout = config.timeout || DEFAULT_TIMEOUT
      dispatch({ type: 'promise.start' });
      pTimeout(promise, timeout).then((r) => {
        setTimeout(() => {
          dispatch({ type: 'promise.success' });
          setTimeout(() => {
            dispatch({ type: 'promise.end' });
            config.onEnd?.(true, r)
          }, config.delayEnd || 100);
        }, config.delaySuccess || 100);
      }).catch(() => {
        setTimeout(() => {
          dispatch({ type: 'promise.error' });
          setTimeout(() => {
            dispatch({ type: 'promise.end' });
            config.onEnd?.(false)
          }, config.delayEnd || 100);
        }, config.delayError || 100);
      })
    }
  }, [ promise ]);
  return state;
}

function PromiseStateReducer(state: PromiseHookState, action) {

  switch (action.type) {

    case 'promise.start':
      return Object.assign({}, state,
        { loading: true, active: true, success: false, error: false })

    case 'promise.success':
      return Object.assign({}, state,
        { loading: false, active: true, success: true, error: false })

    case 'promise.error':
      return Object.assign({}, state,
        { loading: false, active: true, success: false, error: true })

    case 'promise.end':
      return Object.assign({}, state,
        { loading: false, active: false, success: false, error: false })

  }

  return state;
}

export interface PromiseStateConfig {
  delaySuccess ?: number
  delayError   ?: number
  delayEnd     ?: number
  timeout      ?: number
  onEnd        ?: (success: boolean, result?: any) => void
}

export interface PromiseHookState {
  loading ?: boolean
  active  ?: boolean
  success ?: boolean
  error   ?: boolean
}
