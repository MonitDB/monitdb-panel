import { Button, Form, Space, Steps } from 'antd'
import { NextSeo } from 'next-seo'
import { useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'

import ConnectionStep from './components/Connection'
import ResultStep from './components/Result'
import ServerInformationStep from './components/ServerInfo'
import SetUpNewServerStep from './components/Setup'

const steps = [
  {
    title: 'Server Information',
    description: 'Provide server information',
  },
  {
    title: 'Connection',
    description: 'Set up and verify the connection',
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

  const [form] = Form.useForm()
  return (
    <>
      <NextSeo title="Update New Version - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Logs"
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
            <div
              style={{ height: '350px', overflowY: 'auto', padding: '25px' }}
            >
              <div style={{ display: step === 0 ? 'inherit' : 'none' }}>
                <ServerInformationStep />
              </div>
              <div style={{ display: step === 1 ? 'inherit' : 'none' }}>
                <ConnectionStep />
              </div>
              <div style={{ display: step === 2 ? 'inherit' : 'none' }}>
                <SetUpNewServerStep />
              </div>
              <div style={{ display: step === 3 ? 'inherit' : 'none' }}>
                <ResultStep />
              </div>
            </div>
          </Form>
          <div className="flex justify-end">
            <Space>
              {step > 0 && (
                <Button type="default" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <Button type="primary" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            </Space>
          </div>
        </PageContent>
      </Layout>
    </>
  )
}

export default InstallationWizard
