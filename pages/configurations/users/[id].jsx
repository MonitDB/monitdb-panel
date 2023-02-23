import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { Input, Label, Select } from '~/components/form'
import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import * as UserServices from '~/services/user'
import { handleException } from '~/utils/exceptions'

const usersPagePath = '/configurations/users'

const FormSchema = Yup.object().shape({
  idRole: Yup.string().required(),
  loginEmail: Yup.string().email().required(),
  loginName: Yup.string().required(),
  loginPassword: Yup.string(),
  loginEnable: Yup.string().required(),
})

const UserSinglePage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [userData, setUserData] = useState()

  const formik = useFormik({
    initialValues: {
      id: router?.query?.id,
      idRole: '',
      loginEmail: '',
      loginName: '',
      loginPassword: '',
      loginEnable: '',
    },
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      setIsLoading(true)

      try {
        const response = await UserServices.update({
          ...values,
          loginEnable: values.loginEnable === '1' ? true : false,
        })

        if (response?.status === 200) {
          toast.success(`User ${values.loginName} edited!`)
          router.push(usersPagePath)
        }
      } catch (error) {
        toast.error(handleException(error))
        setIsLoading(false)
      }
    },
  })

  const getUserData = useCallback(async () => {
    try {
      const response = await UserServices.getUserById(router?.query?.id)

      setUserData(response?.data)
    } catch (error) {
      toast.error(handleException(error))
      setIsLoading(false)
    }
  }, [router?.query?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const getRoles = useCallback(async () => {
    try {
      const response = await UserServices.listRoles()

      setRoles(response?.data || [])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [])

  const handleDelete = useCallback(async () => {
    if (!userData?.id || !window?.confirm) return

    const confirm = window.confirm(
      `Are you sure you want to delete the user "${userData.loginName}"?`
    )

    if (!confirm) return

    try {
      const response = await UserServices.remove(userData.id)

      if (response?.status === 200) {
        toast.success(`User ${userData.loginName} deleted!`)
        router.push(usersPagePath)
      }
    } catch (error) {
      toast.error(handleException(error))
      setIsLoading(false)
    }
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps

  const rolesOptions = useMemo(() => {
    return [
      {
        label: 'Select...',
        value: '',
      },
      ...roles.map((role) => ({
        label: role.roleName,
        value: role.id,
      })),
    ]
  }, [roles])

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'Select...' },
      { value: '1', label: 'Active' },
      { value: '0', label: 'Inactive' },
    ],
    []
  )

  useEffect(() => {
    if (!userData?.id) return

    formik.setFieldValue('id', router?.query?.id)
    formik.setFieldValue('idRole', userData.idRole)
    formik.setFieldValue('loginEmail', userData.loginEmail)
    formik.setFieldValue('loginName', userData.loginName)
    formik.setFieldValue('loginEnable', userData.loginEnable ? '1' : '0')
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getRoles()
  }, [getUserData, getRoles])

  useEffect(() => {
    if (!router?.query?.id) return

    getUserData()
  }, [getUserData, router?.query?.id])

  return (
    <>
      <NextSeo title="Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Configurations"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations',
                },
                {
                  title: 'Users',
                  href: '/configurations/users',
                },
                {
                  title: `Edit - ${userData?.loginName || ''}`,
                  href: `/configurations/users/${router?.query?.id}`,
                },
              ]}
            />

            {!userData && <Loading />}

            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-2 gap-4 md:max-w-[50%]"
            >
              <Label text="Name" className="col-span-1">
                <Input
                  type="text"
                  name="loginName"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.loginName}
                  hasError={formik.touched.loginName && formik.errors.loginName}
                />
              </Label>
              <Label text="E-mail" className="col-span-1">
                <Input
                  type="text"
                  name="loginEmail"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.loginEmail}
                  hasError={
                    formik.touched.loginEmail && formik.errors.loginEmail
                  }
                />
              </Label>
              <Label text="Password" className="col-span-1">
                <Input
                  type="password"
                  name="loginPassword"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.loginPassword}
                  hasError={
                    formik.touched.loginPassword && formik.errors.loginPassword
                  }
                />
              </Label>
              <Label text="Role" className="col-span-1">
                <Select
                  name="idRole"
                  containerClass="bg-white"
                  placeholder="Selecione a função"
                  options={rolesOptions}
                  value={formik.values.idRole}
                  onChange={(value) => {
                    formik.setFieldValue('idRole', value)
                  }}
                />
              </Label>
              <Label text="Status" className="col-span-1">
                <Select
                  name="loginEnable"
                  containerClass="bg-white"
                  placeholder="Selecione o status"
                  options={statusOptions}
                  value={formik.values.loginEnable}
                  onChange={(value) => {
                    formik.setFieldValue('loginEnable', value)
                  }}
                />
              </Label>
              <div className="col-span-2 flex justify-between items-center">
                <button type="submit" className="btn" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
              <div className="col-span-2 flex bg-danger bg-opacity-10 border border-danger border-opacity-50 p-4 rounded-md">
                <button
                  type="button"
                  className="btn btn-danger ml-auto"
                  onClick={() => handleDelete()}
                >
                  Delete
                </button>
              </div>
            </form>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default UserSinglePage
