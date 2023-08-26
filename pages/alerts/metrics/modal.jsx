import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Checkbox from '~/components/form/checkbox'
import Select from '~/components/form/select'
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
      { value: '', label: 'All times' },
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
      formik.setFieldValue('nmAlert', parameterData?.nmAlert)
      formik.setFieldValue('nmProcedure', parameterData?.nmProcedure)
      formik.setFieldValue('frequencyMinutes', parameterData?.frequencyMinutes)
      formik.setFieldValue(
        'hourStartExecution',
        parameterData?.hourStartExecution
      )
      formik.setFieldValue('hourEndExecution', parameterData?.hourEndExecution)
      formik.setFieldValue('flClear', parameterData?.flClear)
      formik.setFieldValue('vlParameter', parameterData?.vlParameter)
      formik.setFieldValue('dsMetric', parameterData?.dsMetric)
      formik.setFieldValue('vlParameter2', parameterData?.vlParameter2)
      formik.setFieldValue('dsMetric2', parameterData?.dsMetric2)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [serverId, parameterId]) // eslint-disable-line react-hooks/exhaustive-deps

  const formik = useFormik({
    initialValues: {
      id: -1,
      nmAlert: '',
      nmProcedure: '',
      frequencyMinutes: 0,
      hourStartExecution: 0,
      hourEndExecution: 0,
      flClear: false,
      vlParameter: 0,
      dsMetric: '',
      vlParameter2: 0,
      dsMetric2: '',
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
    <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto md:bg-transparent md:overflow-hidden md:flex md:items-center md:justify-center md:bg-black md:bg-opacity-75">
      <div className="p-4 md:bg-white md:w-[600px] md:h-4/5 md:overflow-y-auto md:p-8 lg:h-auto lg:max-h-[80%]">
        <header className="flex items-start mb-10">
          <h2 className="heading-md">Edit metrics</h2>
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
                <label className="w-full font-bold lg:w-1/3" htmlFor="nmAlert">
                  nmAlert
                </label>
                <input
                  type="text"
                  name="nmAlert"
                  className="w-full px-4 h-10 border border-gray-light leading-10 rounded outline-none text-sm lg:w-2/3"
                  placeholder="nmAlert"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nmAlert}
                />
              </div>
              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="nmProcedure"
                >
                  nmProcedure
                </label>
                <input
                  type="text"
                  name="nmProcedure"
                  className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                  placeholder="nmProcedure"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nmProcedure}
                />
              </div>
              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="frequencyMinutes"
                >
                  frequencyMinutes
                </label>
                <Select
                  name="frequencyMinutes"
                  options={frequencyOptions}
                  value={formik.values.frequencyMinutes}
                  containerClass="bg-white border-gray-light lg:w-2/3"
                  onChange={(value) => {
                    formik.setFieldValue('frequencyMinutes', value)
                  }}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-6">
                <label
                  className="w-full font-bold"
                  htmlFor="hourStartExecution"
                >
                  hourStartExecution
                </label>
                <input
                  type="number"
                  name="hourStartExecution"
                  className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm"
                  placeholder="hourStartExecution"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.hourStartExecution}
                />
              </div>
              <div className="col-span-2 flex flex-col space-y-2 md:col-span-6">
                <label className="w-full font-bold" htmlFor="hourEndExecution">
                  hourEndExecution
                </label>
                <input
                  type="number"
                  name="hourEndExecution"
                  className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm"
                  placeholder="hourEndExecution"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.hourEndExecution}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label className="w-full font-bold lg:w-1/3" htmlFor="flClear">
                  flClear
                </label>
                <Checkbox
                  name="flClear"
                  value="1"
                  onChange={(value) => {
                    formik.setFieldValue('flClear', value)
                  }}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="vlParameter"
                >
                  vlParameter
                </label>
                <input
                  type="number"
                  name="vlParameter"
                  className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                  placeholder="vlParameter"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.vlParameter}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label className="w-full font-bold lg:w-1/3" htmlFor="dsMetric">
                  dsMetric
                </label>
                <input
                  type="text"
                  name="dsMetric"
                  className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                  placeholder="dsMetric"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dsMetric}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="vlParameter2"
                >
                  vlParameter2
                </label>
                <input
                  type="number"
                  name="vlParameter2"
                  className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                  placeholder="vlParameter2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.vlParameter2}
                />
              </div>

              <div className="col-span-2 flex flex-col space-y-2 md:col-span-12 lg:flex-row lg:space-y-0 lg:items-center">
                <label
                  className="w-full font-bold lg:w-1/3"
                  htmlFor="dsMetric2"
                >
                  dsMetric2
                </label>
                <input
                  type="text"
                  name="dsMetric2"
                  className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                  placeholder="dsMetric2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dsMetric2}
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
