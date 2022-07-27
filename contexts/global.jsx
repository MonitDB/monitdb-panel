import React, { createContext, useState } from 'react'

const initialState = {
  isModalActive: false,
}

const GlobalContext = createContext(initialState)

const GlobalContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalContextProvider }

export default GlobalContext
