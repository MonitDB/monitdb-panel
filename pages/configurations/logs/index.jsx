/* eslint-disable react-hooks/exhaustive-deps */

import { notification, Select, Table, Tabs } from 'antd'
import { format, parseISO } from 'date-fns'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { HighlightCode } from '~/components/highlighter'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import { ComponentLogs } from '~/components/page/configurations/logs/component-log'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getLogs } from '~/services/logs'

const LogsPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()

  const router = useRouter()

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
  }, [router.query])

  useEffect(() => {
    updateFormFields()
  }, [updateFormFields])

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
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: 'Components',
                  children: <ComponentLogs />,
                },
                {
                  key: '2',
                  label: 'API',
                  children: 'Content of Tab Pane 2',
                },
              ]}
            />
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default LogsPage
