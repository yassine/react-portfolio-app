import * as React from 'react';
import { FlexBox, FlexBoxProps } from './FlexBox.component';

export interface VBoxProps extends FlexBoxProps {
  reverse ?: boolean
}

/* A higher order flex component for better semantics */
export function VBox(props: VBoxProps){
  return <FlexBox {...props} direction = { props.reverse ? 'column-reverse' : 'column' } >
    { props.children }
  </FlexBox>;
}
