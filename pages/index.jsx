import SignUp from '~/components/sign-up'
import Layout from '~/layouts/default'
// import NotFound from '~/pages/404'
// import { getPageData } from '~/services/page'

const HomePage = () => {
  // if (notFound || !pageData) {
  //   return <NotFound message={notFoundMessage} />
  // }

  return (
    <Layout>
      <div className="fixed inset-0 bg-gray">
        <div className="relative w-full h-32 bg-black bg-opacity-10 md:static md:h-full" />
        <div
          className="bg-white w-full h-full pt-8 px-5 md:absolute md:inset-y-0
						md:pt-0 md:w-96 md:shadow-lg md:bg-gray-dark md:flex md:flex-col
						md:justify-center md:h-auto md:px-0"
        >
          <div
            className="relative text-sm text-gray-medium md:absolute
							md:top-1/2 md:left-32 md:p-6 md:py-8 md:transform
							md:-translate-y-1/2 md:rounded-lg md:w-96 md:shadow-lg
							md:bg-white lg:mt-10"
          >
            <h1>Logo</h1>
            <SignUp />
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
