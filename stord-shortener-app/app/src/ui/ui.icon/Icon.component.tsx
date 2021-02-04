import React from 'react';

interface IconProps {
  icon : string
  viewBoxSize ?: number
  userClass ?: string
  width  ?: number
  height ?: number
}

export const Icon = (props: IconProps) =>
  <svg className = { `${props.userClass || ''}` }
       height  = { `${props.width || props.viewBoxSize || 24}` }
       viewBox = { `0 0 ${ props.viewBoxSize || 24 } ${ props.viewBoxSize || 24 }` }
       width   = { `${props.height || props.viewBoxSize || 24}` }
       xmlns     = 'http://www.w3.org/2000/svg'>
    <use stroke    = { 'currentColor' }
         xlinkHref = { `#icon-${props.icon}` } />
  </svg>
