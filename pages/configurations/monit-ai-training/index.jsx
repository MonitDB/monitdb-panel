import { Button, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import AiTrainingDrawer from '~/components/drawers/monitai-training-drawer'
import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useAiTrainingStore } from '~/services/state-manager/ai-training-store';
import { useAiTrainingStoreLocalLLM } from '~/services/state-manager/ai-training-store-local-llm'

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * AiTrainingPage component renders a page for creating and visualizing AI training materials.
 * It displays a table with existing materials and provides options to add new training materials or delete existing ones.
 * The component integrates with the AI training store to fetch and manage training data.
 */

/*******  1a739de9-bd6c-4696-a438-2929650f6344  *******/
const AiTrainingPage = () => {
  const router = useRouter()
  const { query, pathname } = router
  const { userState: user } = useUser()

  const usingRemoteLLMs = JSON.parse(localStorage.getItem('app:usingRemoteLLMs')) ?? false;

  const { trainings, loading, fetchTrainings, deleteTraining } =
    useAiTrainingStore();
    
  const { trainingsLocalLLM, loadingLocalLLM, fetchTrainingsLocalLLM, deleteTrainingLocalLLM } = 
    useAiTrainingStoreLocalLLM();

  const pageSize = 10;

  useEffect(() => {
    if (usingRemoteLLMs) {
      fetchTrainings();
    } else {
      fetchTrainingsLocalLLM();
    }
  }, [fetchTrainings, fetchTrainingsLocalLLM, user])

  const addNewTraining = () => {
    router.push(
      {
        pathname: pathname,
        query: {
          ...query,
          'aitraining-new': 'true',
        },
      },
      undefined,
      { shallow: true }
    )
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'File Name',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Mimetype',
      dataIndex: 'filemimetype',
      key: 'filemimetype',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '',
      render: (text, record) => {
        return (
          <Button type="link" onClick={() => {
            usingRemoteLLMs
              ? deleteTraining(record.idTrainingMaterial)
              : deleteTrainingLocalLLM(record.idTrainingMaterial);
          }}>
            Remove
          </Button>
        )
      },
    },    
  ]

  return (
    <>
      <NextSeo title="AI Training - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="AI Training"
            breadcrumbs={[
              {
                title: 'Configurations',
                href: '/configurations/',
              },
              {
                title: 'Training',
                href: '/configurations/ai-training/',
              },
            ]}
            extra={
              <Button type="primary" onClick={addNewTraining}>
                New Training Material
              </Button>
            }
          />
          <Table
            loading={usingRemoteLLMs ? loading : loadingLocalLLM}
            dataSource={usingRemoteLLMs ? trainings : trainingsLocalLLM}
            columns={columns}
            rowKey="idTrainingMaterial"
            pagination={{
              pageSize: pageSize,
              total: usingRemoteLLMs ? trainings?.length : trainingsLocalLLM?.length,
              showSizeChanger: false,
            }}
          />
          <AiTrainingDrawer />
        </PageContent>
      </Layout>
    </>
  )
}

export default AiTrainingPage
