import React from 'react'

import Grid from '~/components/grid'
import Link from '~/components/link'

const Header = () => {
  return (
    <header className="relative bg-black bg-opacity-20">
      <Grid className="container py-4">
        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <h1 className="font-bold">
            <Link href="/">Logo</Link>
          </h1>
        </div>

        <div className="col-span-12 flex items-center justify-end lg:col-span-5 lg:col-start-7">
          <ul className="flex items-center space-x-10">
            <li>
              <Link href="/">Página Inicial</Link>
            </li>
          </ul>

          <button type="button" className="ml-auto inline-block md:hidden">
            abrir menu
          </button>
        </div>
      </Grid>
    </header>
  )
}

export default Header
