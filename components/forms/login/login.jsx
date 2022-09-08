import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import * as Yup from 'yup'

import { Field, Input, Submit } from '~/components/form'
import Link from '~/components/link'
import UserContext from '~/contexts/user'
import { postLogin } from '~/services/user'
// import FacebookIcon from '~/icons/facebook.svg'
// import GoogleIcon from '~/icons/google.svg'

const SignUpFormSchema = Yup.object().shape({
  login: Yup.string().required(),
  password: Yup.string().required(),
})

const SignUp = () => {
  const { setUserState } = useContext(UserContext)
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema: SignUpFormSchema,
    onSubmit: async () => {
      const response = await postLogin(formik.values)
      const dataResult = response?.data?.result

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
    },
  })

  return (
    <div>
      <div className="prose mb-10">
        <h2>Login</h2>
        <p>
          <strong>Preencha os seus dados no campo abaixo:</strong>
        </p>
      </div>
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
            placeholder="Usuário"
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
            placeholder="Senha"
            onChange={formik.handleChange}
            value={formik.values.password}
            hasError={!!(formik.errors.password && formik.touched.password)}
          />
        </Field>
        <div className="mt-2 col-span-2 md:col-span-12 md:flex md:justify-between md:items-center">
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
            Recuperar password
          </Link>
        </div>
      </form>
      {/* <hr className="my-6 text-gray-medium" />
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
      </div> */}
    </div>
  )
}

export default SignUp
