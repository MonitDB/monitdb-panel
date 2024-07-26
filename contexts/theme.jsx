// context/ThemeContext.js
import { darkTheme, defaultTheme, lightTheme } from 'const/themes'
import { createContext, useContext, useEffect, useState } from 'react'
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme) // Tema padrão

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        // switch (data.theme) {
        //   case 'dark':
        //     setTheme(darkTheme)
        //     break
        //   case 'light':
        //     setTheme(lightTheme)
        //     break
        //   default:
        //     setTheme(defaultTheme)
        //     break
        // }
      } catch {
        // setTheme(darkTheme) // Fallback para o tema padrão em caso de erro
      }
    }

    fetchTheme()
  }, [])

  const Container = styled.div`
    background-color: ${(properties) => properties.theme.background} !important;
    color: ${(properties) => properties.theme.color} !important;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  `

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <StyledThemeProvider theme={theme}>
        <Container>{children}</Container>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
