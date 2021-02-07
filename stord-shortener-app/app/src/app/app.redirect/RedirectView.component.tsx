import * as React                        from 'react'
import { useMemo, useState }             from 'react';
import { useRouteMatch }                 from 'react-router-dom'
import axios                             from 'axios'
import { useApiContext, useTextContext } from 'app.context';
import { useCssTheme, usePromiseState }  from 'ui.hooks';
import { Icon }                          from 'ui.icon';
import { VBox }                          from 'ui.layout'
import styles                            from './RedirectView.style.scss'

const PROMISE_CONFIG = {
  delayEnd: 1500,
  delayError: 500,
  delaySuccess: 500,
}

export function RedirectView() {

  const match = useRouteMatch()
  const key   = match.params['key']
  const theme = useCssTheme()
  const text  = useTextContext()
  const api   = useApiContext()
  const [url, setUrl] = useState(null)
  const promise = useMemo(() => axios.get(`${api}/${key}`)
    .then(({data}) => {
      setUrl(data)
      return data
    }).catch(reason => {
      setUrl(null)
      throw reason
    }), []);

  const promiseState = usePromiseState(promise, Object.assign({}, PROMISE_CONFIG))

   if (url)
     setTimeout(() => window.location = url, 3000)

  const [error, setError] = useState(false)
  // promiseState.error will clear within the configured timeout.
  // saving the error state into a dedicated state variable
  if (!error && promiseState.error)
    setTimeout(() => setError(true), 0)

  return <VBox justify = {"center"} userClass = {styles.container} alignItems={'center'}>
    <VBox justify = {"center"} userClass = {styles.iconContainer} alignItems={'center'}>
    {
      (promiseState?.loading || (!error && !promiseState?.active)) &&
      <Icon icon      = 'spinner'
            userClass = {`${styles.icon} ${styles.spin} ${styles[theme]}`}
            height    = { 128 }
            width     = { 128 } />
    }
    {
      (promiseState?.success ) &&
      <Icon icon      = 'check'
            userClass = {`${styles.icon} ${styles[theme]}`}
            height    = { 128 }
            width     = { 128 } />
    }
    {
      error &&
      <Icon icon      = 'cross'
            userClass = {`${styles.icon} ${styles[theme]} ${styles['error']}`}
            height    = { 128 }
            width     = { 128 } />
    }
    </VBox>
    {
      !error && promiseState?.active &&
      <p className = {`${styles.text} ${styles[theme]}`} id = 'app__shortener__redirect__wait'>
        {text['app.shortener.redirect.wait']}
      </p>
    }
    {
      error && !promiseState?.loading &&
      <p className = {`${styles.text} ${styles[theme]}`} id = 'app__shortener__redirect__error'>
        { text['app.shortener.redirect.error'] }
      </p>
    }
    {
      !error && !promiseState?.active &&
      <p className = {`${styles.text} ${styles[theme]}`} id = 'app__shortener__redirect__redirect'>
        { text['app.shortener.redirect.redirecting'] } <br/>
        <span className = {`${styles.url} ${styles[theme]}`}>{ getHost(url) }</span>
      </p>
    }

  </VBox>
}

function getHost(string) {
  let url;
  try {
    url = new URL(string);
    return url.hostname;
  } catch (e) {
    console.log(e)
    return '';
  }
}
