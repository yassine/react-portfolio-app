import React from 'react';

interface IconProps {
  icon : string
  userClass ?: string
  width  ?: number
  height ?: number
  strokeWidth ?: 0
}

export const Icon = (props: IconProps) => {
  const element = document.getElementById(`icon-${props.icon}`)
  const height  = element?.attributes?.getNamedItem('data-height')?.value
  const width   = element?.attributes?.getNamedItem('data-width')?.value
  const viewBox = element?.attributes?.getNamedItem('data-viewbox')?.value
  const strokeWidth = props.strokeWidth || 0
  return <svg className = {`${props.userClass || ''}`}
       height  = {`${props.height || height}`}
       viewBox = { viewBox }
       width   = {`${props.width || width}`}
       strokeWidth = {strokeWidth}
       xmlns = 'http://www.w3.org/2000/svg'>
    <use stroke = {'currentColor'}
         xlinkHref = {`#icon-${props.icon}`} />
  </svg>
}
