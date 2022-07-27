import React, { useContext } from 'react'

import GlobalContext from '~/contexts/global'

const Modal = () => {
  const { state: globalState, setState: setGlobalState } =
    useContext(GlobalContext)

  const closeModal = () => {
    setGlobalState({ ...globalState, isModalActive: false })
  }

  if (!globalState.isModalActive) {
    return ''
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-80
        md:flex md:items-center md:justify-center"
    >
      <div className="relative rounded-md p-10 bg-white m-auto max-w-[600px]">
        <button
          type="button"
          className="ml-auto block mb-5 border border-black px-2 py-1 uppercase text-xs bg-transparent text-black
          lg:hover:bg-black lg:hover:text-white"
          onClick={closeModal}
        >
          x
        </button>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          quibusdam quaerat magnam. Enim cum quisquam at architecto rem modi,
          veritatis sint nisi, asperiores repellat libero ratione doloribus
          possimus impedit culpa quam. Repellendus qui repellat perspiciatis
          quod provident doloremque soluta dolorem.
        </p>
      </div>
    </div>
  )
}

export default Modal
