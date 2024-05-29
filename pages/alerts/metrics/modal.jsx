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

      formik.setValues(parameterData) // Updated to set all values at once
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
      profileEmailDescription: '', // Add profileEmailDescription field
      emailDescription: '', // Add emailDescription field
      alertMessageENG: '', // Add alertMessageENG field
      clearMessageENG: '', // Add clearMessageENG field
      alertMessagePTB: '', // Add alertMessagePTB field
      clearMessagePTB: '', // Add clearMessagePTB field
      emailInformation1ENG: '', // Add emailInformation1ENG field
      emailInformation2ENG: '', // Add emailInformation2ENG field
      emailInformation1PTB: '', // Add emailInformation1PTB field
      emailInformation2PTB: '', // Add emailInformation2PTB field
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
      width={'80%'}
      onCancel={onClose}
      onOk={formik.submitForm}
      okText="Save"
      height={'75vh'}
      closable={false}
      okButtonProps={{ loading: isSending }}
    >
      <header className="flex items-start mb-10">
        <h2 className="heading-md">Edit metrics</h2>
      </header>
      <div style={{ height: '70vh', overflowY: 'auto' }}>
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
                placeholder="Alert Name"
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
                placeholder="Start Hour Execution"
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
                placeholder="End Hour Execution"
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
                placeholder="Parameter Value"
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
                placeholder="Metric Description"
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
                placeholder="Parameter Value 2"
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
                placeholder="Metric Description 2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.metricDescription2}
              />
            </div>

            {/* Additional fields */}
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="profileEmailDescription"
              >
                Profile Email Description
              </label>
              <Input
                type="text"
                name="profileEmailDescription"
                placeholder="Profile Email Description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.profileEmailDescription}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="emailDescription"
              >
                Email Description
              </label>
              <Input
                type="text"
                name="emailDescription"
                placeholder="Email Description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emailDescription}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="alertMessageENG"
              >
                Alert Message ENG
              </label>
              <Input
                type="text"
                name="alertMessageENG"
                placeholder="Alert Message ENG"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.alertMessageENG}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="clearMessageENG"
              >
                Clear Message ENG
              </label>
              <Input
                type="text"
                name="clearMessageENG"
                placeholder="Clear Message ENG"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clearMessageENG}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="alertMessagePTB"
              >
                Alert Message PTB
              </label>
              <Input
                type="text"
                name="alertMessagePTB"
                placeholder="Alert Message PTB"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.alertMessagePTB}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="clearMessagePTB"
              >
                Clear Message PTB
              </label>
              <Input
                type="text"
                name="clearMessagePTB"
                placeholder="Clear Message PTB"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clearMessagePTB}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="emailInformation1ENG"
              >
                Email Information ENG 1
              </label>
              <Input
                type="text"
                name="emailInformation1ENG"
                placeholder="Email Information ENG 1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emailInformation1ENG}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="emailInformation2ENG"
              >
                Email Information ENG 2
              </label>
              <Input
                type="text"
                name="emailInformation2ENG"
                placeholder="Email Information ENG 2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emailInformation2ENG}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="emailInformation1PTB"
              >
                Email information PTB 1
              </label>
              <Input
                type="text"
                name="emailInformation1PTB"
                placeholder="Email information PTB 1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emailInformation1PTB}
              />
            </div>
            <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
              <label
                className="w-full font-bold lg:w-1/3"
                htmlFor="emailInformation2PTB"
              >
                Email information PTB 2
              </label>
              <Input
                type="text"
                name="emailInformation2PTB"
                placeholder="Email information PTB 2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emailInformation2PTB}
              />
            </div>
          </Grid>
        </form>
      </div>
    </Modal>
  )
}

export default MetricsModal
