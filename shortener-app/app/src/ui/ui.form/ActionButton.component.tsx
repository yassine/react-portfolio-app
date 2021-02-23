import * as React                                         from 'react';
import { useContext, useState }                           from 'react';
import { HBox }                                           from 'ui.layout';
import { Icon }                                           from 'ui.icon';
import { PromiseHookState, useCssState, usePromiseState } from 'ui.hooks';

import styles             from './ActionButton.style.scss';
import { UIThemeContext } from 'ui.theme';

const PROMISE_CONFIG = {
  delayEnd: 1500,
  delayError: 500,
  delaySuccess: 500,
}

export const ActionButton = (props: ButtonProps) => {

  const [ promise, setPromise ]
    = useState(null);

  const promiseConfig = {
    ...PROMISE_CONFIG,
    onEnd: (status, result) => {
      props.onAsyncNotified?.(status, result, props.userContext)
    }
  }

  const promiseState
    = usePromiseState(promise, promiseConfig);

  const cssStateOf = useCssState(styles, ButtonStyleReducer, props, promiseState);
  const theme = useContext(UIThemeContext);

  return <HBox alignContent = {"center"}
               alignItems = {"center"}
               id = {props.id}
               onClick = {() => onButtonClick(props, setPromise, promiseState)}
               userClass = {`${cssStateOf('wrapper', theme)} ${props.userClass} `}>
    {
      props.icon && !promiseState?.loading && !promiseState?.active &&
      <Icon icon = {props.icon}
            height = {props.iconHeight}
            width = {props.iconWidth}
            userClass = {cssStateOf('icon')} />
    }
    {
      promiseState?.loading &&
      <Icon icon = 'spinner'
            userClass = {cssStateOf('icon', 'spin')}
            height = {props.iconHeight}
            width = {props.iconWidth} />
    }
    {
      promiseState?.success &&
      <Icon icon = 'check'
            height = {props.iconHeight}
            width = {props.iconWidth}
            userClass = {cssStateOf('icon')} />
    }
    {
      promiseState?.error &&
      <Icon icon = 'cross'
            height = {props.iconHeight}
            width = {props.iconWidth}
            userClass = {cssStateOf('icon')} />
    }
    {
      props.label &&
      <span> {props.label} </span>
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
  id?: string
  icon?: string
  label: string
  iconWidth?: number
  iconHeight?: number
  userClass?: string
  disabled?: boolean
  onClick?: () => void | Promise<any>
  onAsyncNotified?: (boolean: boolean, result?: any, userContext?: any) => void
  userContext?: any
}
