import React, { useEffect, useState } from 'react';

//interface for the createContext type annotations
interface IContextProps {
  theme: string;
  setTheme: any;
}

//Will see if there is a value 'theme' in localStorage
function getInitialTheme() {
  const userThemePreference = localStorage.getItem('theme');

  if (userThemePreference !== undefined && userThemePreference === 'dark') {
    return 'dark';
  }

  //defalut 'ligth', but we don't need to specify it
  return '';
}

//global context for theme changes
export const ThemeContext = React.createContext({} as IContextProps);

//This function will set the theme changes, will create the value 'theme' = 'dark', in localStorage, if the user
//prefer dark mode and will set 'dark' class in html to apply styles, which are specified with tailwind, If te user
//don't want dark mode, the value will not be created or will be deleted
export function ThemeProvider({ initialTheme, children }: any) {
  //when the theme is set to empty, it will change the theme to light and will delete the localStorage value
  //when the theme is set to 'dark', it will change the theme to dark and will store the value in localSotrage
  let [theme, setTheme] = useState<string>(getInitialTheme);

  function addDarkThemeClass(theme: string) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', theme);
    } else {
      root.classList.remove('dark');
      localStorage.removeItem('theme');
    }
  }

  if (initialTheme) {
    addDarkThemeClass(initialTheme);
  }

  useEffect(() => {
    addDarkThemeClass(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
