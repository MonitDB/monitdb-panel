import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useMemo, useState } from 'react'

import Checkbox from '~/components/form/checkbox'
import Select from '~/components/form/select'
// import Selector from '~/components/form/selector'
import Grid from '~/components/grid'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
// import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'

const AlertsPage = () => {
  // const {
  //   globalState: { servers, serverTypes },
  // } = useGlobal()

  const [isLoading] = useState(false)

  const frequencyOptions = useMemo(
    () => [
      { value: '', label: 'Todos os horários' },
      { value: 1, label: '1 minuto' },
      { value: 5, label: '5 minutos' },
      { value: 20, label: '20 minutos' },
      { value: 60, label: '1 hora' },
      { value: 3600, label: '1 dia' },
      { value: 25_200, label: '1 semana' },
      { value: 32_000, label: '1 mês' },
    ],
    []
  )

  const formik = useFormik({
    initialValues: {
      nmAlert: '',
      nmProcedure: '',
      frequencyMinutes: '',
      hourStartExecution: '',
      hourEndExecution: '',
      flClear: '',
      vlParameter: '',
      dsMetric: '',
      vlParameter2: '',
      dsMetric2: '',
    },
    onSubmit: () => {},
  })

  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <MonitoredServersSidebar />

          <PageContent>
            <header className="flex flex-col mb-10">
              <PageHeader
                title="Custom Metrics"
                breadcrumbs={[
                  {
                    title: 'Alerts',
                    href: '/alerts/',
                  },
                  {
                    title: 'Custom Metrics',
                    href: '/alerts/metrics/',
                  },
                  {
                    title: `Metric`,
                    href: `/alerts/metrics/new`,
                  },
                ]}
              />
            </header>
            <form className="relative w-full mb-10 lg:max-w-[600px] lg:mb-20">
              <h2 className="mb-10 heading-md">New metric</h2>
              <Grid>
                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="nmAlert"
                  >
                    nmAlert
                  </label>
                  <input
                    type="text"
                    name="nmAlert"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                    placeholder="nmAlert"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nmAlert}
                  />
                </div>
                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="NmProcedure"
                  >
                    NmProcedure
                  </label>
                  <input
                    type="text"
                    name="NmProcedure"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                    placeholder="NmProcedure"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.NmProcedure}
                  />
                </div>
                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="frequencyMinutes"
                  >
                    frequencyMinutes
                  </label>
                  <Select
                    name="frequencyMinutes"
                    options={frequencyOptions}
                    value={formik.values.frequencyMinutes}
                    containerClass="bg-white border-white lg:w-2/3"
                    onChange={(value) => {
                      formik.setFieldValue('frequencyMinutes', value)
                    }}
                  />
                </div>

                <div className="col-span-2 flex flex-col space-y-2 md:col-span-6">
                  <label
                    className="w-full font-bold"
                    htmlFor="HourStartExecution"
                  >
                    HourStartExecution
                  </label>
                  <input
                    type="number"
                    name="HourStartExecution"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    placeholder="HourStartExecution"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.HourStartExecution}
                  />
                </div>
                <div className="col-span-2 flex flex-col space-y-2 md:col-span-6">
                  <label
                    className="w-full font-bold"
                    htmlFor="HourEndExecution"
                  >
                    HourEndExecution
                  </label>
                  <input
                    type="number"
                    name="HourEndExecution"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    placeholder="HourEndExecution"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.HourEndExecution}
                  />
                </div>

                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="FlClear"
                  >
                    FlClear
                  </label>
                  <Checkbox
                    name="FlClear"
                    value="1"
                    onChange={(value) => {
                      formik.setFieldValue('FlClear', value)
                    }}
                  />
                </div>

                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="VlParameter"
                  >
                    VlParameter
                  </label>
                  <input
                    type="text"
                    name="VlParameter"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                    placeholder="VlParameter"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.VlParameter}
                  />
                </div>

                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="DsMetric"
                  >
                    DsMetric
                  </label>
                  <input
                    type="text"
                    name="DsMetric"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                    placeholder="DsMetric"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.DsMetric}
                  />
                </div>

                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="VlParameter2"
                  >
                    VlParameter2
                  </label>
                  <input
                    type="text"
                    name="VlParameter2"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                    placeholder="VlParameter2"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.VlParameter2}
                  />
                </div>

                <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                  <label
                    className="w-full font-bold lg:w-1/3"
                    htmlFor="DsMetric2"
                  >
                    DsMetric2
                  </label>
                  <input
                    type="text"
                    name="DsMetric2"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                    placeholder="DsMetric2"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.DsMetric2}
                  />
                </div>

                <div className="col-span-2 flex justify-between items-center md:col-span-12">
                  <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </Grid>
            </form>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsPage
