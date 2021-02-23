import * as React                  from 'react';
import copy                        from 'copy-to-clipboard';
import pTimeout                    from 'p-timeout';
import { useTextContext }          from 'app.context';
import { ActionButton, TextInput } from 'ui.form';
import { HBox, VBox }              from 'ui.layout';
import { useCssState }             from 'ui.hooks';
import styles                      from './ShortenerView.style.scss';

export const ShortenerResultComponent = (props: ShortenerViewProps) => {

  const text = useTextContext()
  const resultCssStateOf = useCssState(styles, ShortenerResultViewCssReducer, props.shortUrl, props.visible);

  return <VBox userClass = {`${resultCssStateOf('group')}`}>

    <TextInput id = 'app__shortener__result__url_input'
               label = {text["app.shortener.url-label"]}
               value = {props.shortUrl || ''}
               userClass = {resultCssStateOf('input')}
    />

    <HBox userClass = {styles.buttonGroup}>
      <ActionButton
        icon = {'copy'}
        iconHeight = {24}
        iconWidth = {24}
        label = {text["app.shortener.copy"]}
        onClick = {() => pTimeout(new Promise((ok) => {
          copy(props.shortUrl, {
            debug: true,
            format: 'text/plain',
            onCopy: () => {
              ok(true);
            }
          })
        }), 5000)} />
      <ActionButton
        icon = {'check'}
        iconWidth = {24}
        iconHeight = {24}
        label = {text["app.shortener.thanks"]}
        onClick = {() => props.onReset?.()}
        userClass = {styles.thankButton} />
    </HBox>
  </VBox>
}


function ShortenerResultViewCssReducer(shortUrl, visible) {
  return {
    visible: visible,
    hidden: !visible
  }
}

interface ShortenerViewProps {
  shortUrl: string
  visible: boolean
  onReset?: () => void
}
