import * as React from 'react';
import {useContext} from "react";

export const TextContext = React.createContext<{[k: string]: string}>({})
export const useTextContext = () => useContext(TextContext)
