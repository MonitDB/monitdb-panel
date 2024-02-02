import { Input, Modal } from 'antd'
import { Select } from 'antd'
import classNames from 'classnames'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Checkbox from '~/components/form/checkbox'
import Grid from '~/components/grid'
import Loading from '~/components/loading'
import useAlerts from '~/hooks/use-alerts'
import {
  getAlertParameterByServerId,
  updateAlertsParameterByServerId,
} from '~/services/alerts'
import { handleException } from '~/utils/exceptions'

const MetricsModal = ({ onClose, serverId, parameterId }) => {
  const {
    stateAlerts: { parameters },
  } = useAlerts()

  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const frequencyOptions = useMemo(
    () => [
      { value: '', label: 'Unactive' },
      { value: 1, label: '1 minutes' },
      { value: 5, label: '5 minutes' },
      { value: 20, label: '20 minutes' },
      { value: 60, label: '1 hour' },
      { value: 3600, label: '1 day' },
      { value: 25_200, label: '1 week' },
      { value: 32_000, label: '1 month' },
    ],
    []
  )

  const getParameterData = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await getAlertParameterByServerId(serverId, parameterId)
      const parameterData = response?.data

      formik.setFieldValue('id', parameterData?.id)
      formik.setFieldValue('alertName', parameterData?.alertName)
      formik.setFieldValue('procedureName', parameterData?.procedureName)
      formik.setFieldValue('frequencyMinutes', parameterData?.frequencyMinutes)
      formik.setFieldValue(
        'hourStartExecution',
        parameterData?.hourStartExecution
      )
      formik.setFieldValue('hourEndExecution', parameterData?.hourEndExecution)
      formik.setFieldValue('clearFlag', parameterData?.clearFlag)
      formik.setFieldValue('parameterValue', parameterData?.parameterValue)
      formik.setFieldValue(
        'metricDescription',
        parameterData?.metricDescription
      )
      formik.setFieldValue('parameterValue2', parameterData?.parameterValue2)
      formik.setFieldValue(
        'metricDescription2',
        parameterData?.metricDescription2
      )
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [serverId, parameterId]) // eslint-disable-line react-hooks/exhaustive-deps

  const formik = useFormik({
    initialValues: {
      id: -1,
      alertName: '',
      procedureName: '',
      frequencyMinutes: 0,
      hourStartExecution: 0,
      hourEndExecution: 0,
      clearFlag: false,
      parameterValue: 0,
      metricDescription: '',
      parameterValue2: 0,
      metricDescription2: '',
    },
    onSubmit: async (values) => {
      setIsSending(true)

      try {
        const response = await updateAlertsParameterByServerId(serverId, {
          ...values,
        })

        if (response?.status === 200) {
          toast.success(`Metrics updated!`)
          onClose(true)
        }
      } catch (error) {
        toast.error(handleException(error))
      } finally {
        setIsSending(false)
      }
    },
  })

  useEffect(() => {
    if (!parameterId || parameters.length === 0) return

    getParameterData()
  }, [getParameterData, parameters, parameterId])

  return (
    <Modal
      open={true}
      width={'60%'}
      onCancel={onClose}
      onOk={formik.submitForm}
      okText="Save"
      closable={false}
      okButtonProps={{ loading: isSending }}
    >
      <header className="flex items-start mb-10">
        <h2 className="heading-md">Edit metrics</h2>
        {/* <button type="button" className="ml-auto mt-1" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} className="text-lg" />
        </button> */}
      </header>
      <div style={{ height: '500px' }}>
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
              <label className="w-full font-bold lg:w-1/3" htmlFor="alertName">
                Alert Name
              </label>
              <Input
                type="text"
                name="alertName"
                placeholder="alertName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.alertName}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="procedureName"
              >
                Procedure Name
              </label>
              <Input
                type="text"
                name="procedureName"
                placeholder="Procedure Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.procedureName}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="frequencyMinutes"
              >
                Frequency (MIN)
              </label>
              <Select
                name="frequencyMinutes"
                options={frequencyOptions}
                value={formik.values.frequencyMinutes}
                style={{ width: '200px' }}
                onChange={(value) => {
                  formik.setFieldValue('frequencyMinutes', value)
                }}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-6">
              <label className="w-full font-bold" htmlFor="hourStartExecution">
                Start Hour Execution
              </label>
              <Input
                type="number"
                name="hourStartExecution"
                placeholder="hourStartExecution"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.hourStartExecution}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-6">
              <label className="w-full font-bold" htmlFor="hourEndExecution">
                End Hour Execution
              </label>
              <Input
                type="number"
                name="hourEndExecution"
                placeholder="hourEndExecution"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.hourEndExecution}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label className="w-full font-bold lg:w-1/3" htmlFor="clearFlag">
                Clear Flag
              </label>
              <Checkbox
                name="clearFlag"
                value="1"
                onChange={(value) => {
                  formik.setFieldValue('clearFlag', value)
                }}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="parameterValue"
              >
                Parameter Value
              </label>
              <Input
                type="number"
                name="parameterValue"
                placeholder="parameterValue"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.parameterValue}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="metricDescription"
              >
                Metric Description
              </label>
              <Input
                type="text"
                name="metricDescription"
                placeholder="metricDescription"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.metricDescription}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="parameterValue2"
              >
                Parameter Value 2
              </label>
              <Input
                type="number"
                name="parameterValue2"
                placeholder="parameterValue2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.parameterValue2}
              />
            </div>

            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="metricDescription2"
              >
                Metric Description 2
              </label>
              <Input
                type="text"
                name="metricDescription2"
                placeholder="metricDescription2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.metricDescription2}
              />
            </div>

            <div className="col-span-2 flex justify-end items-center pt-10 md:col-span-12">
              {/* <Button
                type="default"
                htmlType="submit"
                loading={isSending}
                disabled={isSending}
              >
                {'Save'}
              </Button> */}
            </div>
          </Grid>
        </form>
      </div>
    </Modal>
  )
}

export default MetricsModal
