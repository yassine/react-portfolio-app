import { useEffect, useMemo, useReducer } from 'react';
import pTimeout                           from 'p-timeout';
import pMinDelay                          from 'p-min-delay';

const DEFAULT_TIMEOUT = 3000;

/**
 * Code is a bit imperative as it needs to handle the case of callbacks
 * that fires after the component has been unloaded from the DOM by React.
 */
export function usePromiseState(promise, config: PromiseStateConfig): PromiseHookState {
  const [ state, dispatch ] = useReducer(PromiseStateReducer, {} as PromiseHookState);
  const timeoutRef = useMemo(() => ({ ref: null, valid: true }), [promise])
  useEffect(() => {
    if (promise && !state.active) {
      const timeout = config.timeout || DEFAULT_TIMEOUT
      dispatch({ type: 'promise.start' });
      pMinDelay(pTimeout(promise, timeout), config.delaySuccess)
        .then((r) => {
          if (!timeoutRef.valid) return;
          dispatch({ type: 'promise.success' });
          timeoutRef.ref = setTimeout(() => {
            if (!timeoutRef.valid) return;
            dispatch({ type: 'promise.end' });
            config.onEnd?.(true, r)
            delete timeoutRef.ref;
          }, config.delayEnd || 100);
        }).catch( (reason) => {
          if (!timeoutRef.valid) return;
          dispatch({ type: 'promise.error' });
          timeoutRef.ref = setTimeout(() => {
            if (!timeoutRef.valid) return;
            dispatch({ type: 'promise.end' });
            config.onEnd?.(false)
            delete timeoutRef.ref;
          }, config.delayEnd || 100);
          throw reason;
        })
    }
    return () => {
      // cleanup the timeout if the component is unloaded
      timeoutRef.valid = false;
      if (timeoutRef.ref)
        clearTimeout(timeoutRef.ref)
      timeoutRef.ref   = null;
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
