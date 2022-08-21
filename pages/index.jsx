import SignUp from '~/components/forms/sign-up'
import Cta from '~/components/ui/cta'
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
        className="w-full md:min-h-screen md:flex md:items-center
          md:justify-center"
      >
        <div
          className="w-full md:relative md:flex md:rounded-lg
            md:overflow-hidden lg:max-w-[900px]"
        >
          <div className="p-4 bg-white md:w-1/2 md:p-10">
            <SignUp />
          </div>
          <div
            className="py-10 px-4 bg-blue md:w-1/2 md:px-10 md:flex
              md:flex-col md:justify-center"
          >
            <div className="prose prose-headings:text-white mb-4 text-white md:mb-10">
              <h3>Lorem ipsum!</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Velit,
                cumque!
              </p>
            </div>
            <div>
              <Cta href="/contacto" inverse>
                Entre em contacto
              </Cta>
            </div>
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
