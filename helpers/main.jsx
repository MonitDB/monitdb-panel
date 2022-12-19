import Router from 'next/router'
import { useState } from 'react'

import Contexts from '~/contexts/index'

const Main = ({ children }) => {
  const [isLoadingPage, setIsLoadingPage] = useState(false)

  Router.events.on('routeChangeStart', () => {
    setIsLoadingPage(true)
  })

  Router.events.on('routeChangeComplete', () => {
    setIsLoadingPage(false)
  })

  return (
    <Contexts>
      <div
        className={[
          'fixed inset-0 z-50 bg-white bg-opacity-20 transition-all duration-200 ease-in-out',
          !isLoadingPage ? 'invisible opacity-0' : '',
        ].join(' ')}
      />
      {children}
    </Contexts>
  )
}

export default Main
