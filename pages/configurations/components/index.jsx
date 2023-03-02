import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format, parseISO } from 'date-fns'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import { getComponents } from '~/services/components'
import { getFeatures } from '~/services/features'

import ComponentsModal from './modal'

const ComponentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [componentIdActive, setComponentIdActive] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [features, setFeatures] = useState([])
  const [data, setData] = useState([])

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
      setIsLoaded(true)
    }
  }, [])

  const getFeatureNameById = useCallback(
    (featureId) => {
      const feature = features.find((feature) => feature.id === featureId)

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

            {isLoading && (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}

            {!isLoading && isLoaded && (
              <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                <table className="prose max-w-full w-full mb-4">
                  <thead>
                    <tr className="text-sm font-bold text-gray-dark text-left">
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Code
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Type Component ID
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Feature
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Name
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Query / URL
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Created at
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Enabled
                      </th>
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
                      data.map((component) => (
                        <tr
                          key={`component-${component.componentCode}`}
                          className={`text-sm border-b border-gray-light transition-colors
                          duration-200 ease-in-out cursor-pointer lg:hover:bg-gray-light lg:hover:bg-opacity-50`}
                          onClick={() => {
                            setIsModalOpen(true)
                            setComponentIdActive(component.componentCode)
                          }}
                        >
                          <td>{component.componentCode}</td>
                          <td>{component.idTypeComponent}</td>
                          <td>{getFeatureNameById(component.idFeature)}</td>
                          <td>{component.componentName}</td>
                          <td>{component.componentQuery}</td>
                          <td className="whitespace-nowrap">
                            {format(
                              parseISO(component.componentDataCreate),
                              "dd MMM yyyy kk':'mm"
                            )}
                          </td>
                          <td align="center">
                            {component.componentEnable ? (
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="text-success"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="text-danger"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
