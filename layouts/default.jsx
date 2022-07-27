import React from 'react'

import Footer from '~/components/footer'
import Header from '~/components/header'
import Modal from '~/components/modal'

const Default = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Modal />
    </>
  )
}

export default Default
