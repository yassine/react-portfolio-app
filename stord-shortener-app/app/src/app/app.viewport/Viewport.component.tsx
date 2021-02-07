import styles            from './Viewport.style.scss';
import React             from 'react';
import { VBox }          from 'ui.layout';
import { useCssTheme }   from 'ui.hooks';
import { CardComponent } from 'ui.card';
import { SwitchComponent } from 'ui.switch';

export function Viewport(props: { children: any, onThemeChange: (b: boolean) => void }) {
  const theme = useCssTheme()
  return <VBox userClass = {`${styles.viewport} ${styles[theme]} ${theme}`} id = 'app__viewport'>
    <Content>
      <CardComponent userClass = { `${styles.card}  theme-image ${theme}` }>
        <SwitchComponent
          id        = "app__viewport__theme__switch"
          userClass = { styles.switch }
          onChange  = { (e) => props?.onThemeChange(e) }
        />
        <span className={`${styles.logo} ${styles[theme]}`}>Shortener!</span>
        { props.children }
      </CardComponent>
    </Content>
  </VBox>
}

export function Content(props: { children: any }) {
  return <div className = {styles.main}>
    { props.children }
  </div>;
}
/*
<Icon icon        = {'cut'}
              height      = { 92 }
              userClass   = {`${styles.icon} ${styles[theme]}`}
              width       = { 92 }/>
 */
