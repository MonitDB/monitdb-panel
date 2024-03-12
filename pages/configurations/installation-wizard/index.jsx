import { Form, Steps } from 'antd'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { SOCKET } from '~/utils/client-api'

import DetailsStep from './components/DetailsStep'
import ResultStep from './components/Result'
import ServerInformationStep from './components/ServerInfo'
import SetUpNewServerStep from './components/Setup'

const steps = [
  {
    title: 'Server Information',
    description: 'Provide server information',
  },
  {
    title: 'Details',
    description: 'Set details about this server',
  },
  {
    title: 'Set Up the New Server',
    description: 'Create a new MonitDB server',
  },
  {
    title: 'Result',
  },
]

const InstallationWizard = () => {
  const [step, setStep] = useState(0)
  const [socketID, setSocketID] = useState()
  const [socket, setSocket] = useState()

  const [form] = Form.useForm()

  useEffect(() => {
    if (!socket) setSocket(io(SOCKET))
  }, [socket])

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setSocketID(socket.id)
      })
    }
  }, [socket])

  return (
    <>
      <NextSeo title="Installation Wizard - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Installation Wizard"
            breadcrumbs={[
              {
                title: 'Configurations',
                href: '/configurations/',
              },
              {
                title: 'Installation Wizard',
                href: '/configurations/installation-wizard/',
              },
            ]}
          />
        </PageContent>
        <PageContent removeSidebarMargin={true} className="w-[80%] m-auto">
          <Steps items={steps} current={step} />
          <Form form={form} layout="vertical">
            <div style={{ display: step === 0 ? 'inherit' : 'none' }}>
              <ServerInformationStep
                handleNextStep={() => setStep(step + 1)}
                form={form}
              />
            </div>
            <div style={{ display: step === 1 ? 'inherit' : 'none' }}>
              <DetailsStep
                handleNextStep={() => setStep(step + 1)}
                handlePreviusStep={() => setStep(step - 1)}
                form={form}
              />
            </div>
            <div style={{ display: step === 2 ? 'inherit' : 'none' }}>
              <SetUpNewServerStep
                step={step}
                handleNextStep={() => setStep(step + 1)}
                handlePreviusStep={() => setStep(step - 1)}
                socketID={socketID}
                socket={socket}
                form={form}
              />
            </div>
            <div style={{ display: step === 3 ? 'inherit' : 'none' }}>
              <ResultStep socket={socket} />
            </div>
          </Form>
        </PageContent>
      </Layout>
    </>
  )
}

export default InstallationWizard
