import React, { createContext, useState, useContext, useCallback } from 'react';
import { lightTheme, darkTheme } from '../Theme/Theme';
import { ThemeProvider as StyledProvider } from 'styled-components';

const ThemeContext = createContext({});

function useTheme() {
    const context = useContext(ThemeContext);
    const { ThemeMode, setThemeMode } = context;
  
    const toggleTheme = useCallback(() => {
      if (ThemeMode === "light") {
        setThemeMode("dark");
        window.localStorage.setItem('theme', 'dark');
      }
      else {
        setThemeMode("light")
        window.localStorage.setItem('theme', 'light');
      };
    }, [ThemeMode]);
    
    return [ ThemeMode, toggleTheme];
  }
  
  export { ThemeProvider, useTheme };

const ThemeProvider = ({children}) => {
  const LocalTheme = window.localStorage.getItem('theme') || 'light';
  const [ThemeMode, setThemeMode] = useState(LocalTheme);
  const themeObject = ThemeMode === 'light' ? lightTheme : darkTheme;

  return(
    <ThemeContext.Provider value={{ ThemeMode, setThemeMode }}>
      <StyledProvider theme={themeObject}>
        { children }
      </StyledProvider>      
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;