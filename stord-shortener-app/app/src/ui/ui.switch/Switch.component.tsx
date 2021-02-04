import * as React from 'react';
import styles from './Switch.style.scss';

export const SwitchComponent = (props) => {
  const now = new Date().getUTCDate()
  const id = `switch-${now}`
  return <div className={styles.wrap + ` ${props.userClass || ''}`}>
            <input type = "checkbox" className = {styles.input} id = {id}
                   onChange = {(e) => props.onChange?.(e.target.checked)}/>
            <label htmlFor={id} className = {styles.label}/>
         </div>
}
