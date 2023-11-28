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
            {/* <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore,
              explicabo! Totam inventore iure sed adipisci quaerat architecto
              assumenda, ipsam rerum.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              dolore repellat tempore assumenda neque ratione, et voluptatibus
              iusto, ab odio aliquam voluptatem molestias non sapiente saepe
              laudantium commodi suscipit illum veniam tenetur dignissimos!
              Maiores vero molestias, expedita ut modi harum?
            </p> */}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-8">
          {/* <Image
            src="https://picsum.photos/800/500"
            width="800"
            height="500"
            layout="raw"
          /> */}
        </div>
      </Grid>
    </Layout>
  )
}

export default NotFoundPage
