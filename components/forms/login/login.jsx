import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import * as Yup from 'yup'

import { Field, Input, Submit } from '~/components/form'
import Link from '~/components/link'
import UserContext from '~/contexts/user'
import { postLogin } from '~/services/user'
// import FacebookIcon from '~/icons/facebook.svg'
// import GoogleIcon from '~/icons/google.svg'

const SignUpFormSchema = Yup.object().shape({
  login: Yup.string().email().required(),
  password: Yup.string().required(),
})

const SignUp = () => {
  const { setUserState } = useContext(UserContext)
  const [error, setError] = useState('')
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema: SignUpFormSchema,
    onSubmit: async () => {
      try {
        const response = await postLogin(formik.values)
        const dataResult = response?.data

        if (dataResult?.token) {
          setUserState({
            logged: true,
            name: dataResult?.loginname,
            email: dataResult?.loginemail,
            roleId: dataResult?.idrole,
            token: dataResult?.token,
          })

          router.push('/dashboard')
        }
      } catch {
        setError('Usuário ou senha inválidos')

        setTimeout(() => {
          setError('')
        }, 4000)
      }
    },
  })

  return (
    <form
      className="grid grid-cols-2 gap-5 md:grid-cols-12"
      onSubmit={formik.handleSubmit}
    >
      <Field
        htmlFor="login"
        className="col-span-2 md:col-span-12"
        hasError={!!(formik.errors.login && formik.touched.login)}
        error={formik.errors.login}
      >
        <Input
          id="login"
          name="login"
          type="text"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.login}
          hasError={!!(formik.errors.login && formik.touched.login)}
        />
      </Field>
      <Field
        htmlFor="password"
        className="col-span-2 md:col-span-12"
        hasError={!!(formik.errors.password && formik.touched.password)}
        error={formik.errors.password}
      >
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
          hasError={!!(formik.errors.password && formik.touched.password)}
        />
        {error && (
          <p className="absolute bottom-0 w-full transform translate-y-6 text-right text-xs text-danger">
            {error}
          </p>
        )}
      </Field>
      <div className="flex justify-between items-center mt-2 col-span-2 md:col-span-12">
        <Submit
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
          loadingText="Entrando..."
        >
          Entrar
        </Submit>
        <Link
          href="/forgot-password"
          className="text-sm text-gray-dark underline mt-4 md:mt-0 md:ml-auto"
        >
          Recuperar palavra-passe
        </Link>
      </div>
    </form>
  )
}

export default SignUp
