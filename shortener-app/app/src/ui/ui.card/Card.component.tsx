import * as React      from 'react';
import { VBox }        from 'ui.layout';
import styles          from './Card.style.scss'
import { useCssTheme } from 'ui.hooks';

export function CardComponent(props: CardProps) {
  const theme = useCssTheme()
  return <VBox userClass = { `${styles.card} ${styles[theme]} ${props?.userClass}` }>
    { props.children }
  </VBox>
}

interface CardProps {
  userClass ?: string
  children  ?: any
}
