import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './Application';

ReactDOM.render(
  <Application />,
  document.getElementById('react-app')
);

if (module.hot) {
  module.hot.accept('./Application', () => {
    const Application = require('./Application').Application;
    ReactDOM.render(<Application />, document.getElementById('react-app'));
  })
}

/* static css */
require('global.static.scss')
require('reset.static.scss');
require('fonts/fonts.static.scss');
