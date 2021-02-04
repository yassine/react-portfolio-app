import { ActionButton, TextInput } from 'ui.form';
import { HBox, VBox }              from 'ui.layout';
import styles                      from './ShortenerView.style.scss';
import copy                        from 'copy-to-clipboard';
import * as React                  from 'react';
import { useCssState }             from 'ui.hooks';
import { useTextContext }          from 'app.context';

export const ShortenerResultComponent = (props: ShortenerViewProps) => {

  const text = useTextContext()
  const resultCssStateOf = useCssState(styles, ShortenerResultViewCssReducer, props.shortUrl, props.visible);

  return <VBox userClass = {`${resultCssStateOf('group')}`}>
    <TextInput label     = {text["app.shortener.url-label"]}
               value     = { props.shortUrl || '' }
               userClass = {resultCssStateOf('input')}
    />
    <HBox userClass = {styles.buttonGroup}>
      <ActionButton
        icon        = {'copy'}
        iconHeight  = { 24 }
        iconViewBox = { 24 }
        iconWidth   = { 24 }
        label       = {text["app.shortener.copy"]}
        onClick     = { () => new Promise((ok) => {
          copy(props.shortUrl, {
            debug: true,
            format: 'text/plain',
            onCopy: () => {
              ok(true);
            }
          })
        })}/>
      <ActionButton
        icon = {'check'}
        iconViewBox = {92}
        iconWidth = {24}
        iconHeight = {24}
        onClick = {() => props.onReset?.()}
        userClass = {styles.thankButton}
        label = {text["app.shortener.thanks"]} />
    </HBox>
  </VBox>
}


function ShortenerResultViewCssReducer(shortUrl, visible) {
  return {
    visible : visible,
    hidden  : !visible
  }
}

interface ShortenerViewProps {
  shortUrl: string
  visible: boolean
  onReset?: () => void
}
