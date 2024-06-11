import '@uiw/react-textarea-code-editor/dist.css'

import classNames from 'classnames'
import { useFormik } from 'formik'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

const AceEditor = dynamic(
  () => import('react-ace').then((module_) => module_.default),
  { ssr: false }
)

import { Button, Input, Modal, Select, Spin } from 'antd'

import Grid from '~/components/grid'
import {
  getComponentById,
  getComponentTypes,
  updateComponentById,
} from '~/services/components'
import { getFeatures } from '~/services/features'
import { handleException } from '~/utils/exceptions'

const MetricsModal = ({ onClose, componentId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [features, setFeatures] = useState([])
  const [componentTypes, setComponentTypes] = useState([])

  const getComponentData = useCallback(async () => {
    setIsLoading(true)

    try {
      const [componentResponse, featuresResponse, componentTypesResponse] =
        await Promise.all([
          getComponentById(componentId),
          getFeatures(),
          getComponentTypes(),
        ])

      const componentData = componentResponse?.data

      formik.setValues({
        idTypeComponent: componentData?.idTypeComponent,
        idFeature: componentData?.idFeature,
        componentCode: componentData?.componentCode,
        componentName: componentData?.componentName,
        componentQuery: componentData?.componentQuery,
      })

      setFeatures(featuresResponse?.data)
      setComponentTypes(componentTypesResponse?.data)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [componentId]) // eslint-disable-line react-hooks/exhaustive-deps

  const formik = useFormik({
    initialValues: {
      idTypeComponent: -1,
      idFeature: -1,
      componentCode: '',
      componentName: '',
      componentQuery: '',
    },
    onSubmit: async (values) => {
      setIsSending(true)

      try {
        const response = await updateComponentById(componentId, {
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

  const componentTypesOptions = useMemo(
    () =>
      componentTypes.map((componentType) => ({
        value: componentType.id,
        label: componentType.typeComponentName,
      })),
    [componentTypes]
  )

  useEffect(() => {
    if (!componentId) return

    getComponentData()
  }, [getComponentData, componentId])

  return (
    <Modal
      title="Edit component"
      visible={true}
      onCancel={() => onClose(false)}
      footer={null}
      width="80%"
    >
      <Spin spinning={isLoading}>
        <form
          onSubmit={formik.handleSubmit}
          className="relative w-full"
          noValidate
        >
          <Grid
            className={classNames({
              'opacity-0 invisible': isLoading,
            })}
          >
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="componentCode"
              >
                Code
              </label>
              <Input
                type="text"
                name="componentCode"
                className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.componentCode}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="idTypeComponent"
              >
                Component type
              </label>
              <Select
                className="bg-white w-full lg:w-2/3"
                name="idTypeComponent"
                options={componentTypesOptions}
                onChange={(value) => {
                  formik.setFieldValue('idTypeComponent', value)
                }}
                value={formik.values.idTypeComponent}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label className="w-full font-bold lg:w-1/3" htmlFor="idFeature">
                Feature ID
              </label>
              <Select
                className="bg-white w-full lg:w-2/3"
                name="idFeature"
                options={featuresOptions}
                onChange={(value) => {
                  formik.setFieldValue('idFeature', value)
                }}
                value={formik.values.idFeature}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="componentName"
              >
                Name
              </label>
              <Input
                type="text"
                name="componentName"
                className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.componentName}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="componentQuery"
              >
                Query or URL
              </label>
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <AceEditor
                id="editor"
                aria-label="editor"
                mode="mysql"
                theme="github"
                name="editor"
                fontSize={16}
                minLines={15}
                maxLines={10}
                width="100%"
                showPrintMargin={false}
                showGutter
                placeholder="Write your Query here..."
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                }}
                onChange={formik.handleChange}
                value={formik.values.componentQuery}
                showLineNumbers
              />
            </div>

            <div className="col-span-2 flex justify-end items-center pt-10 md:col-span-12">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSending}
                disabled={isSending}
              >
                Save
              </Button>
            </div>
          </Grid>
        </form>
      </Spin>
    </Modal>
  )
}

export default MetricsModal
