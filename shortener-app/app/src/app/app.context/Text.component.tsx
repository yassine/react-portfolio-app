import * as React from 'react';
import { useTextContext } from './Text.context';

interface TextProps {
  value: string
  userClass?: string
}

export const TextComponent
  = ({ value, userClass }: TextProps) => <span className = { userClass }>{`${useTextContext()[value]}`}</span>

export const TextFragment
  = ({ value }: TextProps) => <React.Fragment> {value} </React.Fragment>
