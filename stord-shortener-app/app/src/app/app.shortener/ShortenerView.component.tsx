import * as React                   from 'react';
import { useReducer }               from 'react';
import axios from 'axios';
import { ShortenerResultComponent } from './ShortenerResult.component';
import { ShortenerPromptComponent } from './ShortenerPrompt.component'
import {useApiContext} from "app.context";


export function ShortenerView() {
  const api = useApiContext()
  const [state, dispatch] = useReducer(ShortenerViewReducer, {
    success  : false,
    shortUrl : ''
  } as ShortenerViewState);

  return <React.Fragment>
    {
      <ShortenerPromptComponent
        visible     = { !state.shortUrl }
        onSubmit    = { url => axios.post(api, url).then(({data}) => data ) }
        onUserReady = { (status, val) => {
          const url = status ? `${window.location}${val}` : val;
          dispatch({ type: 'short.result', data: url, success: status })
        }} />
    }
    {
      <ShortenerResultComponent
        visible  = { !!state.shortUrl }
        shortUrl = { state.shortUrl }
        onReset  = { () => dispatch({ type: 'short.reset' }) } />
    }
  </React.Fragment>;

}

function ShortenerViewReducer(state: ShortenerViewState, action) {

  switch (action.type) {
    case 'short.result':
      return Object.assign({}, state, {
        short    : action.data,
        success  : action.success,
        shortUrl : action.success ? action.data : null,
      })
    case 'short.reset':
      return Object.assign({}, state, {
        short: null,
        success: false,
        shortUrl: null,
      })
  }
  return Object.assign({}, state);
}

interface ShortenerViewState {
  short?: any
  success?: boolean
  shortUrl?: string
}
