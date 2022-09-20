import React, { useContext } from 'react'

import Grid from '~/components/grid'
import GlobalContext from '~/contexts/global'

const Footer = () => {
  const { globalState, setGlobalState } = useContext(GlobalContext)

  const openModal = () => {
    setGlobalState({ ...globalState, isModalActive: true })
  }

  return (
    <footer>
      <Grid className="container py-20 bg-black bg-opacity-20">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <button
            type="button"
            className="border border-black p-2 uppercase text-xs bg-black text-white
              lg:hover:bg-transparent lg:hover:text-black"
            onClick={openModal}
          >
            Abrir modal - apenas para testar contextApi
          </button>
          <p className="mt-4">&copy; Copyright FutureBrand</p>
        </div>
      </Grid>
    </footer>
  )
}

export default Footer
