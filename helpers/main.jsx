import Router from 'next/router'
import { useEffect, useState } from 'react'

import Contexts from '~/contexts/index'

const Main = ({ children }) => {
  const [isLoadingPage, setIsLoadingPage] = useState(false)

  useEffect(() => {
    const onStart = () => {
      setIsLoadingPage(true)
    }

    const onDone = () => {
      setIsLoadingPage(false)
    }

    Router.events.on('routeChangeStart', onStart)
    Router.events.on('routeChangeComplete', onDone)

    return () => {
      Router.events.off('routeChangeStart', onStart)
      Router.events.off('routeChangeComplete', onDone)
    }
  }, [])

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
