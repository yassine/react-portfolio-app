import * as React from 'react';
import { FlexBox, FlexBoxProps } from './FlexBox.component';

export interface HBoxProps extends FlexBoxProps {
  reverse ?: boolean
}

/* A higher order flex component for better semantics */
export function HBox(props: HBoxProps){
  return <FlexBox  direction = { props.reverse ? 'row-reverse' : 'row' } {...props} >
    { props.children }
  </FlexBox>;
}
