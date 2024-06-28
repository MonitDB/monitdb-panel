import { Form, Steps } from 'antd'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { NextSeo } from 'next-seo'
import { useEffect, useRef, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { APIV2 } from '~/utils/client-api'
import { getUserToken } from '~/utils/cookies'

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
  const [connectionId, setConnectionId] = useState()

  const [form] = Form.useForm()
  const eventSource = useRef()

  useEffect(() => {
    eventSource.current = new EventSourcePolyfill(APIV2 + 'events', {
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
        'x-api-key': process.env.apiKey,
      },
    })

    eventSource.current.addEventListener('connection', function (event) {
      const data = JSON.parse(event.data)
      setConnectionId(data.id)
    })

    setInterval(() => {
      if (eventSource.current.readyState == EventSource.CLOSED) {
        eventSource.current = new EventSourcePolyfill(APIV2 + '/events', {
          headers: {
            Authorization: `Bearer ${getUserToken()}`,
            'x-api-key': process.env.apiKey,
          },
        })
      }
    }, 3000)

    return () => {
      eventSource.current.close()
    }
  }, [])

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
                connectionId={connectionId}
                eventSource={eventSource.current}
                form={form}
              />
            </div>
            <div style={{ display: step === 3 ? 'inherit' : 'none' }}>
              <ResultStep
                eventSource={eventSource.current}
                handlePreviusStep={() => setStep(step - 1)}
              />
            </div>
          </Form>
        </PageContent>
      </Layout>
    </>
  )
}

export default InstallationWizard
