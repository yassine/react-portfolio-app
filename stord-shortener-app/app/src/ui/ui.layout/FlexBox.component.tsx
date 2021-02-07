import * as React   from 'react';
import styles       from './FlexBox.component.scss'
import { Property } from 'csstype';
import { HBox }     from "ui.layout/HBox.component";

interface DirectionProps {
  direction ?: Direction
}

export interface FlexBoxProps {
  alignContent ?: AlignContent
  alignItems   ?: Align
  children     ?: any
  id           ?: string
  justify      ?: Justify
  userClass    ?: any
  userStyle    ?: any
  wrap         ?: Wrap
  onClick      ?: (event:MouseEvent) => void
}

export function FlexBox(props: FlexBoxProps & DirectionProps) {
  const style = Object.assign({}, props.userStyle || {}, getStyle(props));
  return <section className = { `${styles.flexbox} ${props.userClass || ''}` }
                  id        = { props.id }
                  style     = { style }
                  onClick   = { (e) => props.onClick?.(e as any) }>
    { props.children }
  </section>;
}


function getStyle(props: FlexBoxProps & DirectionProps){
  return {
    alignContent   : props.alignContent || 'start',
    alignItems     : props.alignItems   || 'start',
    flexDirection  : (props.direction || 'row') as Property.FlexDirection,
    flexWrap       : props.wrap,
    justifyContent : props.justify || 'start',
  };
}

type Wrap      = 'nowrap' | 'wrap' | 'wrap-reverse'
type Justify   = 'center' | 'flex-end' | 'space-around' | 'space-between' | 'space-evenly' | 'flex-start'
type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type Align     = 'start' | 'end' | 'center' | 'stretch' | 'baseline'
type AlignContent = 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around'
