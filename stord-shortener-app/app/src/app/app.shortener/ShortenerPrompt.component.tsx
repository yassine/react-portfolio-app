import * as React                 from 'react';
import { ActionButton, TextArea } from 'ui.form';
import { VBox }                   from 'ui.layout';
import { useCssState }            from 'ui.hooks';
import { useTextContext }         from 'app.context';
import styles                     from './ShortenerView.style.scss';
import { useState }               from 'react';

export const ShortenerPromptComponent = (props: ShortenerPromptProps) => {

  const text = useTextContext()
  const [ url, setUrl ] = useState('')
  const [ error, setError ] = useState('')
  const cssStateOf = useCssState(styles, ShortenerFormViewCssReducer, props.visible, error);

  return <VBox userClass = { cssStateOf('group') }>
    <TextArea id          = { 'app__shortener__prompt__input' }
              value       = { url || '' }
              userClass   = { styles.input }
              rows        = { 8 }
              placeholder = { text["app.shortener.input-label"] }
              onKeyUp     = { onKeyUp }
              onChange    = { (val) => {
                              setUrl(val.target.value.trim())
                              setError(null)
                            }}
    />
    {
      <div id        = 'app__shortener__shorten__callout'
           className = { cssStateOf('callout') }>
        { error }
      </div>
    }
    {
      <ActionButton
        userClass   = { styles.shortenButton }
        id          = {'app__shortener__shorten__button'}
        icon        = { 'cut' }
        iconWidth   = { 18 }
        iconHeight  = { 18 }
        onClick     = { () => {
          const validation = validURL(url, text)
          if (validation === true) {
            return props.onSubmit?.(url)
          } else {
            setError(validation)
          }
        } }
        label       = { text["app.shortener.submit"] }
        onAsyncNotified = { (status, result) => {
          props.onUserReady?.(status, result)
          setUrl('')
        } }/>
    }
  </VBox>

}

function onKeyUp(val) {
  if ( val.keyCode === 13)
    val.target.blur()
}

function validURL(url: string, messages) {
  return url?.length > 0 ? isValidHttpUrl(url) ? true
          : messages['app.shortener.validation.url_syntax']
          : messages['app.shortener.validation.no_url'];
}

export function ShortenerFormViewCssReducer(visible, error) {
  return {
    visible: visible,
    hidden: !visible,
    error: !!error
  }
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}


interface ShortenerPromptProps {
  visible: boolean
  onSubmit?: (s: string) => void
  onUserReady?: (s: boolean, r: any) => void
}
