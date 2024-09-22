import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(()=>{
    return JSON.parse(localStorage.getItem("THEME")) 
  });
  

  useEffect(() => {
    window.localStorage.setItem('THEME', JSON.stringify(isDark));
  }, [isDark]);
  return (
    <>
      <ThemeContext.Provider value={{ isDark, setIsDark }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { ThemeContext, useContext, ThemeProvider };
