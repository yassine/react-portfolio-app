import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './Application';

ReactDOM.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
  document.getElementById('react-app')
);

if (module.hot) {
  module.hot.accept('./Application', () => {
    const App = require('./Application').Application;
    ReactDOM.render(<App />, document.getElementById('react-app'));
  })
}

/* static css */
require('global.static.scss')
require('reset.static.scss');
require('fonts/fonts.static.scss');
