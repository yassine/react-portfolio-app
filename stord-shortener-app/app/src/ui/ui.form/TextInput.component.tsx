import * as React         from 'react';
import styles             from './TextInput.style.scss';
import { VBox }           from 'ui.layout';
import { useCssState }    from 'ui.hooks';

export const TextInput = (props: TextInputProps) => {
  const cssStateOf = useCssState(styles, () => ({}))
  return <VBox userClass = { cssStateOf('container') }>
          {
            props.label &&
            <p className={ cssStateOf('label') }>{ props.label }:</p>
          }
          <input className   = { cssStateOf('input') + ` ${props.userClass || ''}` }
                 placeholder = { props.placeholder }
                 onChange    = { e => props.onChange?.(e) }
                 onKeyUp     = { e => props.onKeyUp?.(e)}
                 value       = { props.value }
                 id          = { props.id || null }
                 type        = 'text' />
        </VBox>;
}

interface TextInputProps {
  placeholder ?: string
  onChange    ?: (e: any) => void
  onKeyUp     ?: (e: any) => void
  userClass   ?: string
  label       ?: string
  value       ?: string
  id          ?: string
}
