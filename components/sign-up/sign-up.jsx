import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import { Field, Input, Submit } from '~/components/form'
import FacebookIcon from '~/icons/facebook.svg'
import GoogleIcon from '~/icons/google.svg'

const SignUpFormSchema = Yup.object().shape({
  login: Yup.string().required(),
  password: Yup.string().required(),
})

const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      licenseKey: 'Client_DataBase',
      login: '',
      password: '',
    },
    validationSchema: SignUpFormSchema,
    onSubmit: (values) => {
      console.log(values)
    },
  })

  return (
    <div>
      <p className="mb-4">
        <strong>Preencha os seus dados no campo abaixo:</strong>
      </p>
      <form
        className="grid grid-cols-2 gap-5 md:grid-cols-12"
        onSubmit={formik.handleSubmit}
      >
        <Field
          text="Usuário"
          htmlFor="login"
          className="col-span-2 md:col-span-12"
          hasError={!!(formik.errors.login && formik.touched.login)}
          error={formik.errors.login}
        >
          <Input
            id="login"
            name="login"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.login}
            hasError={!!(formik.errors.login && formik.touched.login)}
          />
        </Field>
        <Field
          text="Senha"
          htmlFor="password"
          className="col-span-2 md:col-span-12"
          hasError={!!(formik.errors.password && formik.touched.password)}
          error={formik.errors.password}
        >
          <Input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            hasError={!!(formik.errors.password && formik.touched.password)}
          />
        </Field>
        <Submit
          className="mt-2 col-span-2 md:col-span-12"
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
          loadingText="Entrando..."
        >
          Entrar
        </Submit>
      </form>
      <hr className="my-6 text-gray-medium" />
      <p className="mb-4">
        <strong>Ou faça login com:</strong>
      </p>
      <div className="flex items-center justify-center space-x-4">
        <button
          type="button"
          className="flex items-center border border-gray-medium
						rounded h-10 px-3 font-bold text-xs transition-colors duration-200
						hover:bg-gray-light"
        >
          <GoogleIcon className="w-5 h-5 mr-2" /> Google
        </button>
        <button
          type="button"
          className="flex items-center border border-gray-medium
						rounded h-10 px-3 font-bold text-xs transition-colors duration-200
						hover:bg-gray-light"
        >
          <FacebookIcon className="w-5 h-5 mr-2" /> Facebook
        </button>
      </div>
    </div>
  )
}

export default SignUp
