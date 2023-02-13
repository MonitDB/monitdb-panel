import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'

import Checkbox from '~/components/form/checkbox'
import Select from '~/components/form/select'
// import Selector from '~/components/form/selector'
import Grid from '~/components/grid'
import useAlerts from '~/hooks/use-alerts'
// import useGlobal from '~/hooks/use-global'

const MetricsModal = ({ onClose, parameterId }) => {
  // const {
  //   globalState: { servers, serverTypes },
  // } = useGlobal()
  const {
    stateAlerts: { parameters },
  } = useAlerts()

  const [isLoading] = useState(false)
  const [currentParameter, setCurrentParameter] = useState({})

  const frequencyOptions = useMemo(
    () => [
      { value: '', label: 'Todos os horários' },
      { value: 1, label: '1 minuto' },
      { value: 5, label: '5 minutos' },
      { value: 20, label: '20 minutos' },
      { value: 60, label: '1 hora' },
      { value: 3600, label: '1 dia' },
      { value: 25_200, label: '1 semana' },
      { value: 32_000, label: '1 mês' },
    ],
    []
  )

  const formik = useFormik({
    initialValues: {
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
    onSubmit: () => {},
  })

  useEffect(() => {
    if (!parameterId || parameters.length === 0) return

    const parameter = parameters.find((p) => p.id === parameterId)

    formik.setFieldValue('nmAlert', parameter?.nmAlert)
    formik.setFieldValue('nmProcedure', parameter?.nmProcedure)
    formik.setFieldValue('frequencyMinutes', parameter?.frequencyMinutes)
    formik.setFieldValue('hourStartExecution', parameter?.hourStartExecution)
    formik.setFieldValue('hourEndExecution', parameter?.hourEndExecution)
    formik.setFieldValue('flClear', parameter?.flClear)
    formik.setFieldValue('vlParameter', parameter?.vlParameter)
    formik.setFieldValue('dsMetric', parameter?.dsMetric)
    formik.setFieldValue('vlParameter2', parameter?.vlParameter2)
    formik.setFieldValue('dsMetric2', parameter?.dsMetric2)

    setCurrentParameter(parameter)
  }, [setCurrentParameter, parameters, parameterId]) // eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line no-console
  console.log(currentParameter)

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto md:bg-transparent md:overflow-hidden md:flex md:items-center md:justify-center md:bg-black md:bg-opacity-75">
      <div className="p-4 md:bg-white md:w-[600px] md:h-4/5 md:overflow-y-auto md:p-8 lg:h-auto lg:max-h-[80%]">
        <header className="flex items-start mb-10">
          <h2 className="heading-md">Edit metrics</h2>
          <button type="button" className="ml-auto mt-1" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} className="text-lg" />
          </button>
        </header>
        <form className="relative w-full">
          <Grid>
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
                htmlFor="NmProcedure"
              >
                NmProcedure
              </label>
              <input
                type="text"
                name="NmProcedure"
                className="w-full px-4 h-10 border border-gray-light bg-white leading-10 rounded outline-none text-sm lg:w-2/3"
                placeholder="NmProcedure"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.NmProcedure}
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
              <label className="w-full font-bold" htmlFor="hourStartExecution">
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
              <label className="w-full font-bold lg:w-1/3" htmlFor="dsMetric2">
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
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Grid>
        </form>
      </div>
    </div>
  )
}

export default MetricsModal
