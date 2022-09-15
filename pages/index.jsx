import Login from '~/components/forms/login'
import Image from '~/components/image'
import Layout from '~/layouts/clean'
// import NotFound from '~/pages/404'
// import { getPageData } from '~/services/page'

const HomePage = () => {
  // if (notFound || !pageData) {
  //   return <NotFound message={notFoundMessage} />
  // }

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
                <strong>Preencha os seus dados nos campos abaixo:</strong>
              </p>
            </div>
            <Login />
          </div>
        </div>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line unicorn/prevent-abbreviations
// export const getServerSideProps = async ({ locale }) => {
//   try {
//     const response = await getPageData({ slug: 'homepage', lang: locale })
//     const notFound = response.status !== 200 || !response?.data?.length

//     return {
//       props: {
//         notFound,
//         pageData: response?.data?.[0] || '',
//       },
//     }
//   } catch (error) {
//     return {
//       props: {
//         notFound: true,
//         notFoundMessage: error?.message,
//       },
//     }
//   }
// }

export default HomePage
