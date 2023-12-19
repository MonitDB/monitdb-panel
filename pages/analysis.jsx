/* eslint-disable unicorn/no-array-reduce */
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'antd'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useMemo } from 'react'

import Chart from '~/components/chart'
import ExportButton from '~/components/export-button'
import Selector from '~/components/form/selector'
// import Checkbox from '~/components/form/checkbox'
import Link from '~/components/link'
import { PageContent, PageWrapper } from '~/components/page'
// import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'

const AnalysisPage = () => {
  // const {
  //   globalState: { serverEnvironments },
  // } = useGlobal()
  const statusOptions = useMemo(
    () => [
      { value: '15min', label: '15 minutes' },
      { value: '1h', label: '1 hour' },
      { value: '6h', label: '6 hours' },
      { value: '24h', label: '24 hours' },
      { value: '7 dias', label: '7 days' },
      { value: '14 dias', label: '14 days' },
      { value: '28 dias', label: '28 days' },
    ],
    []
  )

  const datasets = {
    Log_Full_Scans_Count: {
      code: 'Log_Full_Scans_Count',
      options: [],
      parent: 'a',
    },
    Log_Batch_Requests_Count: {
      code: 'Log_Batch_Requests_Count',
      options: [],
      parent: 'a',
    },
    Log_Tempdb_Usage: { code: 'Log_Tempdb_Usage', options: [], parent: 'a' },
    Log_Lock_Waits_Count: {
      code: 'Log_Lock_Waits_Count',
      options: [],
      parent: 'a',
    },
    Log_Tempdb_Space_Use: {
      code: 'Log_Tempdb_Space_Use',
      options: [],
      parent: 'a',
    },
    Log_Processes: { code: 'Log_Processes', options: [], parent: 'a' },
    Log_Memory_Usage: { code: 'Log_Memory_Usage', options: [], parent: 'a' },
    Log_Executions_SP: { code: 'Log_Executions_SP', options: [], parent: 'a' },
    Log_CPU_Usage: { code: 'Log_CPU_Usage', options: [], parent: 'a' },
    Log_User_Connections_Count: {
      code: 'Log_User_Connections_Count',
      options: [],
      parent: 'a',
    },
    Log_SQL_Compilations_Count: {
      code: 'Log_SQL_Compilations_Count',
      options: [],
      parent: 'a',
    },
    Log_Page_Splits_Count: {
      code: 'Log_Page_Splits_Count',
      options: [],
      parent: 'a',
    },
    Log_Lock_Timeouts_Count: {
      code: 'Log_Lock_Timeouts_Count',
      options: [],
      parent: 'a',
    },
    Log_Latch_Waits_Count: {
      code: 'Log_Latch_Waits_Count',
      options: [],
      parent: 'a',
    },
  }

  const groupedDatasets = Object.values(datasets).reduce(
    (accumulator, dataset) => {
      if (!accumulator[dataset.parent]) {
        accumulator[dataset.parent] = []
      }
      accumulator[dataset.parent].push(dataset)
      return accumulator
    },
    {}
  )

  const datasetsOptions = Object.entries(groupedDatasets).map(
    ([parent, datasets]) => (
      <optgroup key={parent} label={` ▼ ${parent}`} title={parent}>
        {datasets.map((dataset, index) => (
          <option
            key={index}
            value={dataset.code}
            title={dataset.code}
            className=""
          >
            &nbsp;&nbsp;&nbsp;{dataset.code.replace(/_/g, ' ')}
          </option>
        ))}
      </optgroup>
    )
  )

  const formik = useFormik({
    initialValues: {
      status: [],
      start_date: '',
      end_date: '',
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  return (
    <>
      <NextSeo title="Analysis - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent
            removeSidebarMargin={true}
            className="border-b border-gray-light"
          >
            <form
              className="w-full flex flex-col space-y-4 mb-5 xl:space-x-4 xl:space-y-0 xl:flex-row"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex items-center">
                <strong className="block mr-2 whitespace-nowrap text-sm">
                  Interval
                </strong>
                <Selector
                  name="status"
                  value={formik.values.status}
                  options={statusOptions}
                  onChange={(value) => {
                    formik.setFieldValue('status', value)
                  }}
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="date"
                  name="start_date"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.start_date}
                />
                <FontAwesomeIcon icon={faArrowRight} />
                <input
                  type="date"
                  name="end_date"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.end_date}
                />
              </div>
              <Button type="dashed">Compare</Button>
            </form>
            <div className="flex items-center">
              <ul
                className="flex items-center border-r border-r-gray pr-4 mr-4
                text-blue text-sm space-x-3"
              >
                <li>
                  <Link href="/analysis/" className="">
                    Last Hour
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Lasts 6hrs
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Last 24hrs
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Lasts 7 days
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Lasts 14 days
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Today
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    This week
                  </Link>
                </li>
              </ul>
              <ExportButton fileName="ANALISYS" />
            </div>
          </PageContent>

          <PageContent
            removeSidebarMargin={true}
            className="border-b border-gray-light"
          >
            <div className="w-4/5 mb-10 bg-white">
              <Chart />
            </div>
            <div className="w-full flex flex-col md:flex-row">
              <div className="flex flex-col md:flex-row md:space-x-4 md:w-4/5">
                <div className="w-60">
                  <input
                    type="text"
                    name="metrics"
                    placeholder="Search by metrics"
                    className="w-full px-4 h-10 mb-2 bg-white leading-10 rounded outline-none text-sm"
                  />
                  <select
                    size="15"
                    className="w-full appearance-none border border-gray-light text-xs"
                    name="metrics_filter"
                  >
                    {datasetsOptions}
                  </select>
                </div>
                <div className="w-60">
                  <input
                    type="text"
                    name="cluster"
                    placeholder="Search by cluster"
                    className="w-full px-4 h-10 mb-2 bg-white leading-10 rounded outline-none text-sm"
                  />
                  <select
                    size="15"
                    className="w-full appearance-none border border-gray-light text-xs"
                    name="cluster_filter"
                  >
                    <option
                      value="r1,4:base,s36:4c07d85a-92f3-4f0e-b040-0121aab069ab,7:Cluster,1,4:Name,s15:azurevm-sqmtest,"
                      title="azurevm-sqmtest"
                    >
                      {' '}
                      azurevm-sqmtest{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s6:sm-dc2,"
                      title="sm-dc2"
                    >
                      {' '}
                      sm-dc2{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s7:sqm-dc1,"
                      title="sqm-dc1"
                    >
                      {' '}
                      sqm-dc1{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s14:sqm-sqlmonitor,"
                      title="sqm-sqlmonitor"
                    >
                      {' '}
                      sqm-sqlmonitor{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:260ca7e9-c6fa-4cc5-8de2-e05e68114e71,7:Cluster,1,4:Name,s22:sscdbcluster.ssc.local,"
                      title="sscdbcluster.ssc.local"
                    >
                      {' '}
                      sscdbcluster.ssc.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s28:ssc-web-staging.smdemo.local,"
                      title="ssc-web-staging.smdemo.local"
                    >
                      {' '}
                      ssc-web-staging.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s22:staging01.smdemo.local,"
                      title="staging01.smdemo.local"
                    >
                      {' '}
                      staging01.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s22:staging02.smdemo.local,"
                      title="staging02.smdemo.local"
                      selected="selected"
                      className="selected"
                    >
                      {' '}
                      staging02.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s19:test01.smdemo.local,"
                      title="test01.smdemo.local"
                    >
                      {' '}
                      test01.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s19:test02.smdemo.local,"
                      title="test02.smdemo.local"
                    >
                      {' '}
                      test02.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s23:workload01.smdemo.local,"
                      title="workload01.smdemo.local"
                    >
                      {' '}
                      workload01.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s23:workload02.smdemo.local,"
                      title="workload02.smdemo.local"
                    >
                      {' '}
                      workload02.smdemo.local{' '}
                    </option>
                  </select>
                </div>
              </div>
              <div className="w-full md:w-1/5"></div>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AnalysisPage
