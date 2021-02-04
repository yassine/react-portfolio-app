import styles            from './Viewport.style.scss';
import React             from 'react';
import { VBox }          from 'ui.layout';
import { useCssTheme }   from 'ui.hooks';
import { CardComponent } from 'ui.card';
import { Icon }          from 'ui.icon';
import { SwitchComponent } from 'ui.switch';

export function Viewport(props: { children: any, onThemeChange: (b: boolean) => void }) {
  const theme = useCssTheme()
  return <VBox userClass = {`${styles.viewport} ${styles[theme]} ${theme}`}>
    <Content>
      <CardComponent userClass = { styles.card }>
        <SwitchComponent
          userClass = { styles.switch }
          onChange  = { (e) => props?.onThemeChange(e) }
        />
        <Icon icon        = {'cut'}
              height      = { 92 }
              userClass   = {`${styles.icon} ${styles[theme]}`}
              viewBoxSize = { 128 }
              width       = { 92 }/>
        <span className={`${styles.logo} ${styles[theme]}`}>Shortener!</span>
        { props.children }
      </CardComponent>
    </Content>
  </VBox>
}

function onChecked(val) {

}

export function Content(props: { children: any }) {
  return <div className = {styles.main}>
    {props.children}
  </div>;
}
