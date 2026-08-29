import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table } from 'antd'
import { format, parseISO } from 'date-fns'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import { getComponents } from '~/services/components'
import { getFeatures } from '~/services/features'
import { truncateString } from '~/utils/truncateString'

import ComponentsModal from './modal'

const ComponentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [componentIdActive, setComponentIdActive] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [features, setFeatures] = useState([])
  const [data, setData] = useState([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getData = useCallback(async () => {
    setIsLoading(true)
    setData([])

    try {
      const componentsResponse = await getComponents()
      const featuresResponse = await getFeatures()
      setData(componentsResponse?.data)
      setFeatures(featuresResponse?.data)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFeatureNameById = useCallback(
    (featureId) => {
      const feature = features?.find((feature) => feature?.id === featureId)
      return feature?.featureName
    },
    [features]
  )

  const handleComponentsModalClose = useCallback(
    (forceRefresh) => {
      setIsModalOpen(false)
      setComponentIdActive('')

      forceRefresh && getData()
    },
    [getData]
  )

  useEffect(() => {
    getData()
  }, [getData])

  const columns = [
    {
      title: 'Code',
      dataIndex: 'componentCode',
      key: 'componentCode',
    },
    {
      title: 'Type Component ID',
      dataIndex: 'idTypeComponent',
      key: 'idTypeComponent',
    },
    {
      title: 'Feature',
      dataIndex: 'idFeature',
      key: 'idFeature',
      render: (text, record) => getFeatureNameById(record.idFeature),
    },
    {
      title: 'Name',
      dataIndex: 'componentName',
      key: 'componentName',
    },
    {
      title: 'Query / URL',
      dataIndex: 'componentQuery',
      key: 'componentQuery',
      render: (value) => truncateString(value, 50),
    },
    {
      title: 'Created at',
      dataIndex: 'componentDataCreate',
      key: 'componentDataCreate',
      render: (text) => format(parseISO(text), "dd MMM yyyy kk':'mm"),
    },
    {
      title: 'Enabled',
      dataIndex: 'componentEnable',
      key: 'componentEnable',
      render: (text, record) =>
        record.componentEnable ? (
          <FontAwesomeIcon icon={faCheck} className="text-success" />
        ) : (
          <FontAwesomeIcon icon={faXmark} className="text-danger" />
        ),
    },
  ]

  return (
    <>
      <NextSeo title="Components - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Components"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations/',
                },
                {
                  title: 'Components',
                  href: '/alerts/components/',
                },
              ]}
            />

            <Table
              pagination={{ hideOnSinglePage: true }}
              loading={isLoading}
              columns={columns}
              dataSource={data}
              rowKey={(record) => record.componentCode}
              onRow={(record) => ({
                onClick: () => {
                  setIsModalOpen(true)
                  setComponentIdActive(record.componentCode)
                },
                style: { cursor: 'pointer' },
              })}
            />
          </PageContent>
        </PageWrapper>
      </Layout>

      {isModalOpen && componentIdActive && (
        <ComponentsModal
          componentId={componentIdActive}
          onClose={handleComponentsModalClose}
        />
      )}
    </>
  )
}

export default ComponentsPage
