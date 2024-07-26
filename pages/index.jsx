import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'

import Login from '~/components/forms/login'
import Image from '~/components/image'
import Layout from '~/layouts/clean'
import * as Cookies from '~/utils/cookies'

const HomePage = () => {
  const router = useRouter()

  const userToken = useMemo(() => Cookies.getUserToken(), [])

  useEffect(() => {
    if (userToken) {
      router.push('/dashboard')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (userToken) return ''

  return (
    <Layout>
      <div
        className="w-full border-b-8 border-b-blue bg-white min-h-screen md:bg-transparent
          md:flex md:items-center md:justify-center"
      >
        <div
          className="w-full p-4 bg-white md:relative md:flex md:rounded-lg md:p-10
            md:shadow-md md:overflow-hidden lg:max-w-[480px]"
        >
          <div className="w-full">
            <div className="prose mb-10 text-center">
              <Image
                src="/images/logos/advance-care.png"
                width="758"
                height="259"
                alt=""
                className="w-full max-w-[260px] h-auto mx-auto"
              />
              <p>
                <strong>Fill your credentials in the fields below:</strong>
              </p>
            </div>
            <Login />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
