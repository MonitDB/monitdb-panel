import Layout from '~/layouts/default'
// import NotFound from '~/pages/404'
// import { getPageData } from '~/services/page'

const HomePage = () => {
  // if (notFound || !pageData) {
  //   return <NotFound message={notFoundMessage} />
  // }

  return (
    <Layout>
      <div>
        <p>Homepage</p>
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
