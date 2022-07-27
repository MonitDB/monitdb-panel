import React from 'react'

import { GlobalContextProvider } from './global'

const Contexts = ({ children }) => {
  return <GlobalContextProvider>{children}</GlobalContextProvider>
}

export default Contexts
