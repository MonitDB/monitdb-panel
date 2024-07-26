// context/ThemeContext.js
import { darkTheme, defaultTheme, lightTheme } from 'const/themes'
import { createContext, useEffect, useState } from 'react'
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { useUser } from '../hooks'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme)
  const { userState } = useUser()

  const userPreferences = userState.preferences

  useEffect(() => {
    switch (userPreferences?.theme) {
      case 'dark':
        setTheme(darkTheme)
        break
      case 'light':
        setTheme(lightTheme)
        break
      default:
        setTheme(defaultTheme)
        break
    }
  }, [userPreferences?.theme])

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
