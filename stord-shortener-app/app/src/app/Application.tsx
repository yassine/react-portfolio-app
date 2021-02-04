import * as React                    from 'react';
import text                          from 'text.json';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { TextContext, ApiContext }   from 'app.context';
import { UIThemeContext }            from 'ui.theme';
import { IconLibrary }               from 'ui.icon';
import { Viewport }                  from 'app.viewport';
import { ShortenerView }             from 'app.shortener'
import { RedirectView }              from 'app.redirect';
import {useState} from "react";

export const Application = () => {
  const [theme, setTheme] = useState(false)
  const themeName = theme ? 'theme-light' : 'theme-dark';
  return <ApiContext.Provider value = { 'api' }>
    <TextContext.Provider value = {text}>
      <UIThemeContext.Provider value = { themeName }>
        <BrowserRouter>
          <IconLibrary />
          <Viewport onThemeChange = { setTheme }>
            <Switch>
              <Route path  = '/'
                     exact = { true }
                     component = {ShortenerView} />
              <Route path = '/:key'
                     component = {RedirectView} />
            </Switch>
          </Viewport>
        </BrowserRouter>
      </UIThemeContext.Provider>
    </TextContext.Provider>
  </ApiContext.Provider>;
}

