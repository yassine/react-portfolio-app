import * as React                        from 'react'
import { VBox }                          from 'ui.layout'
import { useRouteMatch }                 from 'react-router-dom'
import axios                             from 'axios'
import styles                            from './RedirectView.style.scss'
import { useMemo, useState }             from 'react';
import { useCssTheme, usePromiseState }  from 'ui.hooks';
import { Icon }                          from 'ui.icon';
import { useApiContext, useTextContext } from 'app.context';

const PROMISE_CONFIG = {
  delayEnd: 1500,
  delayError: 500,
  delaySuccess: 500,
}

export function RedirectView() {

  const match = useRouteMatch()
  const key = match.params['key']
  const theme = useCssTheme()
  const text = useTextContext()
  const api = useApiContext()
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

  const [error, setError] = useState(false)

  if (!error && promiseState.error)
    setError(true)

  if (url)
    window.location = url

  return <VBox justify = {"center"} userClass = {styles.container}>
    {
      promiseState?.loading &&
      <Icon icon = 'spinner'
            userClass = {`${styles.icon} ${styles.spin} ${styles[theme]}`}
            height = {128}
            width = {128}
            viewBoxSize = {32} />
    }
    {
      promiseState?.success &&
      <Icon icon = 'check'
            userClass = {`${styles.icon} ${styles[theme]}`}
            height = {128}
            width = {128}
            viewBoxSize = {92} />
    }
    {
      error &&
      <Icon icon = 'cross'
            userClass = {`${styles.icon} ${styles[theme]} ${styles['error']}`}
            height = {128}
            width = {128}
            viewBoxSize = {92} />
    }
    {
      promiseState?.active && !error &&
      <p className = {`${styles.text} ${styles[theme]}`}>
        {text['app.shortener.redirect.wait']}
      </p>
    }

    {
      error && !promiseState?.loading &&
      <p className = {`${styles.text} ${styles[theme]}`}>
        {text['app.shortener.redirect.error']}
      </p>
    }

  </VBox>
}
