import { useContext }     from 'react';
import { UIThemeContext } from 'ui.theme';

export const useCssTheme = () => useContext(UIThemeContext)
