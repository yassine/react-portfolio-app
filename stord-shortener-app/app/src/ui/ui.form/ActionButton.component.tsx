import * as React                        from 'react';
import { useContext, useMemo, useState } from 'react';
import { HBox }                          from 'ui.layout';
import { Icon }     from 'ui.icon';
import { PromiseHookState, useCssState, usePromiseState } from 'ui.hooks';

import styles             from './ActionButton.style.scss';
import { UIThemeContext } from 'ui.theme';

const PROMISE_CONFIG = {
  delayEnd: 1500,
  delayError: 500,
  delaySuccess: 500,
}

export const ActionButton = (props: ButtonProps) => {

  const [promise, setPromise]
    = useState(null);

  const promiseConfig = {
    ...PROMISE_CONFIG,
    onEnd: (status, result) => {
      props.onAsyncNotified?.(status, result, props.userContext)
    }
  }

  const promiseState
    = usePromiseState(promise, promiseConfig);

  const activePromiseStates
    = Object.keys(promiseState).filter(k => promiseState[k]);

  const cssStateOf = useCssState(styles, ButtonStyleReducer, props, promise);
  const theme = useContext(UIThemeContext);

  return <HBox alignContent = {"center"}
               alignItems   = {"center"}
               onClick      = {() => onButtonClick(props, setPromise, promiseState)}
               userClass    = {`${cssStateOf('wrapper', theme, ...activePromiseStates)} ${props.userClass} `}>
    {
      props.icon && !promiseState?.loading && !promiseState?.active &&
      <Icon icon        = { props.icon }
            height      = { props.iconHeight || 24 }
            width       = { props.iconWidth || 24 }
            userClass   = { cssStateOf('icon') }
            viewBoxSize = { props.iconViewBox || 24 } />
    }
    {
      promiseState?.loading &&
      <Icon icon        = 'spinner'
            userClass   = { cssStateOf('icon', 'spin') }
            height      = { props.iconHeight || 24 }
            width       = { props.iconWidth || 24 }
            viewBoxSize = { 32 } />
    }
    {
      promiseState?.success &&
      <Icon icon        = 'check'
            height      = { props.iconHeight || 24 }
            width       = { props.iconWidth || 24 }
            userClass   = { cssStateOf('icon') }
            viewBoxSize = { 92 } />
    }
    {
      promiseState?.error &&
      <Icon icon        = 'cross'
            height      = { props.iconHeight || 24 }
            width       = { props.iconWidth || 24 }
            userClass   = { cssStateOf('icon') }
            viewBoxSize = { 90 } />
    }
    {
      props.label &&
      <span> { props.label } </span>
    }
  </HBox>;
};


function onButtonClick(props, setPromise, promiseState) {
  if (props.onClick && !promiseState?.active && !props.disabled) {
    const result = props.onClick();
    if (result instanceof Promise) {
      setPromise(result);
    }
  }
}

function ButtonStyleReducer(props, promiseState: PromiseHookState) {
  return {
    disabled: props.disabled,
    active: promiseState?.active,
    success: promiseState?.success,
    error: promiseState?.error,
    loading: promiseState?.loading
  }
}

interface ButtonProps {
  icon?: string
  label: string
  iconViewBox ?: number
  iconWidth   ?: number
  iconHeight  ?: number
  userClass?: string
  disabled?: boolean
  onClick?: () => void | Promise<any>
  onAsyncNotified ?: (boolean: boolean, result?: any, userContext?: any) => void
  userContext     ?: any
}
