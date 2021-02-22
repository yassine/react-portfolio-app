import * as React from 'react';
import styles     from './Inputs.style.scss';
import { VBox }   from 'ui.layout';
import { useCssState }    from 'ui.hooks';

export const TextArea = (props: TextAreaProps) => {
  const cssStateOf = useCssState(styles, () => ({}))
  return <VBox userClass = { cssStateOf('container') + ` ${props.userClass || ''}` }>
    {
      props.label &&
      <p className={ cssStateOf('label') }>{ props.label }:</p>
    }
    <textarea className   = { cssStateOf('textarea') }
           placeholder = { props.placeholder }
           onChange    = { e => props.onChange?.(e) }
           onKeyUp     = { e => props.onKeyUp?.(e)}
           value       = { props.value }
           rows        = {props.rows || null}
           cols        = {props.rows || null}
           id          = { props.id || null } />
  </VBox>;
}

interface TextAreaProps {
  placeholder ?: string
  onChange    ?: (e: any) => void
  onKeyUp     ?: (e: any) => void
  userClass   ?: string
  label       ?: string
  value       ?: string
  id          ?: string
  rows        ?: number
  cols        ?: number
}
