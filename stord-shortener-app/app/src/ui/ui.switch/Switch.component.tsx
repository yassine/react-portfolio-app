import * as React      from 'react';
import styles          from './Switch.style.scss';
import { useCssTheme } from 'ui.hooks';

export const SwitchComponent = (props) => {
  const theme = useCssTheme()
  const id = props.id || `switch-${new Date().getUTCDate()}`
  return <div className={styles.wrap + ` ${styles[theme]} ${props.userClass || ''}`}>
            <input type = "checkbox" className = { `${styles.input} ${styles[theme]}` }
                   onChange = {(e) => props.onChange?.(e.target.checked)}  id = { id }/>
            <label htmlFor={id} className = { `${styles.label} ${styles[theme]}` }  id = { `${id}__label` }/>
         </div>
}
