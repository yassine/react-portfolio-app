import * as React     from 'react';
import { useContext } from 'react';

export const ApiContext = React.createContext<string>('')
export const useApiContext = () => useContext(ApiContext)
