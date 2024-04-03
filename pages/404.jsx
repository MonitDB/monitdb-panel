import Grid from '~/components/grid'
import Layout from '~/layouts/default'

const NotFoundPage = ({ message }) => {
  return (
    <Layout>
      <Grid className="container items-center py-9 md:py-20">
        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <div className="space-y-10">
            <h2 className="font-bold text-3xl">404 Not Found</h2>
            {message && <p>{message}</p>}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-8"></div>
      </Grid>
    </Layout>
  )
}

export default NotFoundPage
