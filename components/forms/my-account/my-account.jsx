import { useFormik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'

import { Field, Input, Submit } from '~/components/form'
import UserContext from '~/contexts/user'

const MyAccountFormSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().required(),
})

const MyAccount = () => {
  const { userState } = useContext(UserContext)
  const [error, setError] = useState('')
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: MyAccountFormSchema,
    onSubmit: async () => {
      try {
        console.log('update data') // eslint-disable-line no-console
      } catch {
        setError('Algum erro aconteceu, tente novamente mais tarde.')

        setTimeout(() => {
          setError('')
        }, 4000)
      }
    },
  })

  useEffect(() => {
    formik.setFieldValue('name', userState?.name)
    formik.setFieldValue('email', userState?.email)
  }, [formik, userState])

  return (
    <form
      className="grid grid-cols-2 gap-x-4 w-full md:w-2/3 md:grid-cols-12"
      onSubmit={formik.handleSubmit}
    >
      <div className="col-span-2 mb-5 space-y-4 md:col-span-12">
        <h2 className="text-2xl font-bold">Seus dados</h2>
        <p className="w-full text-sm md:w-2/3">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod atque
          nulla quis quia dolor ipsum, quas magni quibusdam temporibus quo?
        </p>
      </div>
      <Field
        htmlFor="name"
        className="col-span-2 md:col-span-6"
        hasError={!!(formik.errors.name && formik.touched.name)}
        error={formik.errors.name}
      >
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Nome"
          onChange={formik.handleChange}
          value={formik.values.name}
          hasError={!!(formik.errors.name && formik.touched.name)}
        />
      </Field>
      <Field
        htmlFor="email"
        className="col-span-2 md:col-span-6"
        hasError={!!(formik.errors.email && formik.touched.email)}
        error={formik.errors.email}
      >
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="E-mail"
          onChange={formik.handleChange}
          value={formik.values.email}
          hasError={!!(formik.errors.email && formik.touched.email)}
        />
      </Field>
      <div className="mt-2 col-span-2 md:col-span-12 md:flex md:justify-between md:items-center">
        <Submit
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
          loadingText="Salvando..."
        >
          Salvar
        </Submit>
      </div>
      {error && (
        <div className="col-span-2 w-full text-right text-danger text-sm md:col-span-12">
          <p>{error}</p>
        </div>
      )}
    </form>
  )
}

export default MyAccount
