import * as React         from 'react';
import { useCssState }    from 'ui.hooks'
import { UIThemeContext } from 'ui.theme'
import { renderHook }     from "@testing-library/react-hooks/dom";

describe("when I provide a css state hook with a target component css class", function () {

  it("I should get the list of css classes reflecting the css state", function () {
    const wrapper = ({ children }) => <UIThemeContext.Provider value={"dark"}>{ children }</UIThemeContext.Provider>
    const { result: { current: cssStateOf } } = renderHook(() => useCssState({
      dark      : 'dark-class',
      active    : 'active-class',
      disabled  : 'disabled-class',
      component : 'component-class'
    }, () => ({
      active    : true,
      disabled  : false
    }), []), { wrapper })

    expect(cssStateOf('component').split(' '))
      .toEqual(jasmine.arrayWithExactContents(['dark-class', 'active-class', 'active', 'component-class']))
  })

});

