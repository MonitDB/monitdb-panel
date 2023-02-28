import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
// import { getComponents } from '~/services/components'
import { getFeatures } from '~/services/features'

import DataMock from './mock.json'
import ComponentsModal from './modal'

const ComponentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [componentIdActive, setComponentIdActive] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [features, setFeatures] = useState([])
  const [data, setData] = useState([])

  const getComponents = useCallback(async () => {
    setIsLoading(true)
    setData([])

    try {
      // const componentsResponse = await getComponents()
      const featuresResponse = await getFeatures()

      // setData(componentsResponse?.data)
      setFeatures(featuresResponse?.data)
      setData(DataMock)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFeatureNameById = useCallback(
    (featureId) => {
      const feature = features.find((feature) => feature.id === featureId)

      return feature?.featureName
    },
    [features]
  )

  const handleComponentsModalClose = useCallback(() => {
    setIsModalOpen(false)
    setComponentIdActive(0)

    // forceRefresh && getComponents()
  }, [])

  useEffect(() => {
    // setData(DataMock)
    getComponents()
    setIsLoading(false)
  }, [getComponents])

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
                  href: '/Configurations/',
                },
                {
                  title: 'Components',
                  href: '/alerts/components/',
                },
              ]}
            />

            {!isLoading ? (
              <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                <table className="prose max-w-full w-full mb-4">
                  <thead>
                    <tr className="text-sm font-bold text-gray-dark text-left">
                      <th className="border-b-2 border-gray-light">ID</th>
                      <th className="border-b-2 border-gray-light">
                        Type Component ID
                      </th>
                      <th className="border-b-2 border-gray-light">Feature</th>
                      <th className="border-b-2 border-gray-light">Code</th>
                      <th className="border-b-2 border-gray-light">Name</th>
                      <th className="border-b-2 border-gray-light">
                        Query / URL
                      </th>
                      <th className="border-b-2 border-gray-light">
                        Created at
                      </th>
                      <th className="border-b-2 border-gray-light">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-10 text-center">
                          No components found
                        </td>
                      </tr>
                    )}

                    {data.length > 0 &&
                      data.map((component, index) => (
                        <tr
                          key={`component-${index}`}
                          className={`text-sm border-b border-gray-light transition-colors
                          duration-200 ease-in-out cursor-pointer lg:hover:bg-gray-light lg:hover:bg-opacity-50`}
                          onClick={() => {
                            setIsModalOpen(true)
                            setComponentIdActive(component.IDCOMPONENT)
                          }}
                        >
                          <td>{component.IDCOMPONENT}</td>
                          <td>{component.IDTYPECOMPONENT}</td>
                          <td>{getFeatureNameById(component.IDFEATURE)}</td>
                          <td>{component.COMPONENTCODE}</td>
                          <td>{component.COMPONENTNAME}</td>
                          <td>{component.COMPONENTQUERY}</td>
                          <td>{component.COMPONENTDATACREATE}</td>
                          <td>{component.COMPONENTENABLE}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}
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
