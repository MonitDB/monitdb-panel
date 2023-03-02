import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Select from '~/components/form/select'
import Grid from '~/components/grid'
import Loading from '~/components/loading'
import {
  // getComponentById,
  updateComponentById,
} from '~/services/components'
import { getFeatures } from '~/services/features'
import { handleException } from '~/utils/exceptions'

const MetricsModal = ({ onClose, componentId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [features, setFeatures] = useState([])

  const getComponentData = useCallback(async () => {
    setIsLoading(true)

    try {
      // const response = await getComponentById(componentId)
      const featuresResponse = await getFeatures()

      setFeatures(featuresResponse?.data)

      // const componentData = response?.data

      // formik.setFieldValue('IDCOMPONENT', componentData?.IDCOMPONENT)
      // formik.setFieldValue('IDTYPECOMPONENT', componentData?.IDTYPECOMPONENT)
      // formik.setFieldValue('IDFEATURE', componentData?.IDFEATURE)
      // formik.setFieldValue('COMPONENTCODE', componentData?.COMPONENTCODE)
      // formik.setFieldValue('COMPONENTNAME', componentData?.COMPONENTNAME)
      // formik.setFieldValue('COMPONENTQUERY', componentData?.COMPONENTQUERY)
      // formik.setFieldValue(
      //   'COMPONENTDATACREATE',
      //   componentData?.COMPONENTDATACREATE
      // )
      // formik.setFieldValue('COMPONENTENABLE', componentData?.COMPONENTENABLE)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [componentId]) // eslint-disable-line react-hooks/exhaustive-deps

  const formik = useFormik({
    initialValues: {
      IDTYPECOMPONENT: -1,
      IDFEATURE: -1,
      IDCOMPONENT: -1,
      COMPONENTCODE: '',
      COMPONENTNAME: '',
      COMPONENTQUERY: '',
      COMPONENTDATACREATE: '',
      COMPONENTENABLE: -1,
    },
    onSubmit: async (values) => {
      setIsSending(true)

      try {
        const response = await updateComponentById({
          ...values,
        })

        if (response?.status === 200) {
          toast.success(`Component updated!`)
          onClose(true)
        }
      } catch (error) {
        toast.error(handleException(error))
      } finally {
        setIsSending(false)
      }
    },
  })

  const featuresOptions = useMemo(
    () =>
      features.map((feature) => ({
        value: feature.id,
        label: feature.featureName,
      })),
    [features]
  )

  useEffect(() => {
    if (!componentId) return

    getComponentData()
  }, [getComponentData, componentId])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto md:bg-transparent md:overflow-hidden md:flex md:items-center md:justify-center md:bg-black md:bg-opacity-75">
      <div className="p-4 md:bg-white md:w-[600px] md:h-4/5 md:overflow-y-auto md:p-8 lg:h-auto lg:max-h-[80%]">
        <header className="flex items-start mb-10">
          <h2 className="heading-md">Edit component</h2>
          <button type="button" className="ml-auto mt-1" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} className="text-lg" />
          </button>
        </header>
        <div>
          <form
            onSubmit={formik.handleSubmit}
            className="relative w-full"
            noValidate
          >
            {isLoading && <Loading />}
            <Grid
              className={classNames({
                'opacity-0 invisible': isLoading,
              })}
            >
              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="IDCOMPONENT"
                >
                  ID
                </label>
                <input
                  type="text"
                  name="IDCOMPONENT"
                  className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.IDCOMPONENT}
                />
              </div>
              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="IDTYPECOMPONENT"
                >
                  Type Component ID
                </label>
                <input
                  type="text"
                  name="IDTYPECOMPONENT"
                  className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.IDTYPECOMPONENT}
                />
              </div>
              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="IDFEATURE"
                >
                  Feature ID
                </label>
                <Select
                  containerClass="bg-white w-full lg:w-2/3"
                  name="IDFEATURE"
                  options={featuresOptions}
                  onChange={(value) => {
                    formik.setFieldValue('IDFEATURE', value)
                  }}
                  value={formik.values.IDFEATURE}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="COMPONENTCODE"
                >
                  Code
                </label>
                <input
                  type="text"
                  name="COMPONENTCODE"
                  className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.COMPONENTCODE}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="COMPONENTNAME"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="COMPONENTNAME"
                  className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.COMPONENTNAME}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="COMPONENTQUERY"
                >
                  Query or URL
                </label>
                <input
                  type="text"
                  name="COMPONENTQUERY"
                  className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.COMPONENTQUERY}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="COMPONENTDATACREATE"
                >
                  Created at
                </label>
                <input
                  type="text"
                  name="COMPONENTDATACREATE"
                  className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.COMPONENTDATACREATE}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="COMPONENTENABLE"
                >
                  Enable
                </label>
                <Select
                  containerClass="bg-white w-full lg:w-2/3"
                  name="COMPONENTENABLE"
                  options={[
                    { value: 1, label: 'Active' },
                    { value: 0, label: 'Inactive' },
                  ]}
                  onChange={(value) => {
                    formik.setFieldValue('COMPONENTENABLE', value)
                  }}
                  value={formik.values.COMPONENTENABLE}
                />
              </div>

              <div className="col-span-2 flex justify-end items-center pt-10 md:col-span-12">
                <button type="submit" className="btn" disabled={isSending}>
                  {isSending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MetricsModal
