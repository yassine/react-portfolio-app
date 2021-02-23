import { useMemo }     from "react";
import { useCssTheme } from 'ui.hooks/Theme.hook';

export function useCssState(styles, reducer, ...dependencies) {
  const theme = useCssTheme() || ''

  if (process.env.NODE_ENV === 'development')
    // for development & qa, original classnames will be added as well
    // to ease automated qa tests. This branch will be dropped by webpack for the production build.
    return useCssStateDev(styles, reducer, ...dependencies);

  return useMemo(() => {
    const stateActivationObject = reducer(...dependencies);
    return (...classNames) => Object.keys(stateActivationObject)
        .filter(k => !!stateActivationObject[k])
        .map(k => stateActivationObject[k] == true
                  ? styles[k] : stateActivationObject[k] )
        .reduce( (acc, current) => `${acc} ${current}`,
          classNames.concat([theme])
            .map(className => styles[className])
            .reduce((acc, current) => `${acc} ${current || ''}`, '')
            .trim()
        ).trim();
  }, dependencies.concat(theme));
}

function useCssStateDev(styles, reducer, ...dependencies) {
  const theme = useCssTheme() || ''
  return useMemo(() => {
    const stateActivationObject = reducer(...dependencies);
    return (...classNames) => Object.keys(stateActivationObject)
      .filter(k => !!stateActivationObject[k])
      .map(k => `${k} ${ stateActivationObject[k] == true ? styles[k] : stateActivationObject[k] }` )
      .reduce( (acc, current) => `${acc} ${current}`,
        classNames.concat([theme])
          .map(className => styles[className])
          .reduce((acc, current) => `${acc} ${current || ''}`, '')
          .trim()
      ).trim();
  }, dependencies.concat(theme));
}
