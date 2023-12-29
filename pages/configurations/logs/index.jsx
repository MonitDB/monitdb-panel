/* eslint-disable react-hooks/exhaustive-deps */

import { notification, Select, Table } from 'antd'
import { format, parseISO } from 'date-fns'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { HighlightCode } from '~/components/highlighter'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getLogs } from '~/services/logs'

const MAX_POSTS_PER_PAGE = 10

const LogsPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()

  const router = useRouter()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: MAX_POSTS_PER_PAGE,
    current: 1,
  })

  const serversOptions = useMemo(
    () => [
      { value: '', label: 'All servers' },
      ...servers.map(({ serverName }) => ({
        value: serverName,
        label: serverName,
      })),
    ],
    [servers]
  )
  const formik = useFormik({
    initialValues: {
      PageNumber: 1,
      ServerName: router.query.ServerName || '',
    },
  })

  const handleChangeField = useCallback(
    (values) => {
      const parameters_ = {
        ...formik.values,
      }

      for (const { name, value } of values) {
        parameters_[name] = value
        formik.setFieldValue(name, value)
      }

      const query = Object.keys(parameters_)
        .filter((key) => parameters_[key])
        .map((key) => `${key}=${parameters_[key]}`)
        .join('&')

      router.push(`/configurations/logs/?${query}`)
    },
    [formik.values] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const updateFormFields = useCallback(async () => {
    const fields = Object.keys(router.query)

    for (const field of fields) {
      formik.setFieldValue(field, router.query[field])
    }

    setLoading(true)

    try {
      const response = await getLogs({
        page: Number.parseInt(router.query.PageNumber, 10) || 1,
        pageSize: MAX_POSTS_PER_PAGE,
        serverName: router.query.ServerName,
      })

      setData(response?.data?.logs || [])
      setPagination({
        ...pagination,
        totalResults: response?.data?.totalResults || 0,
      })
    } catch {
      notification.error({
        message: 'Error to load the logs',
        description: 'Please verify manually the erros at db.',
      })
    }
    setLoading(false)
  }, [router.query])

  useEffect(() => {
    updateFormFields()
  }, [updateFormFields])

  const renderExpandableContent = (record) => {
    return <HighlightCode language="javascript">{record}</HighlightCode>
  }

  return (
    <>
      <NextSeo title="Logs - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent
            className="border-b border-gray-light"
            removeSidebarMargin={true}
          >
            <PageHeader
              title="Logs"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations/',
                },
                {
                  title: 'Logs',
                  href: '/alerts/logs/',
                },
              ]}
            />

            <form
              className="w-full flex flex-col space-y-4 max-w-[760px]
                  xl:space-x-4 xl:space-y-0 xl:flex-row"
            >
              <Select
                name="ServerName"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={serversOptions}
                value={formik.values.ServerName}
                onChange={(value) => {
                  handleChangeField([
                    { name: 'ServerName', value },
                    { name: 'PageNumber', value: 1 },
                  ])
                }}
              />
            </form>
          </PageContent>

          <PageContent removeSidebarMargin={true}>
            <Table
              dataSource={data.map((d) => ({ ...d, key: d.id }))}
              size="small"
              loading={loading}
              expandable={{
                expandedRowRender: (record) =>
                  renderExpandableContent(record.componentLogResult),
              }}
              columns={[
                { title: 'Name', dataIndex: 'componentName' },
                { title: 'Server Name', dataIndex: 'serverName' },
                { title: 'Component Code', dataIndex: 'componentCode' },
                {
                  title: 'Created At',
                  dataIndex: 'componentLogDataCreate',
                  render: (date) =>
                    format(parseISO(date), 'dd/MM/yyyy HH:mm:ss'),
                },
              ]}
              pagination={{
                total: pagination.totalResults,
                current: pagination.current,
                showSizeChanger: false,
                onChange: (page) => {
                  handleChangeField([{ name: 'PageNumber', value: page }])

                  setPagination({ ...pagination, current: page })
                  window.scrollTo(0, 0)
                },
              }}
            />
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default LogsPage
