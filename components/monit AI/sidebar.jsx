/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react-hooks/exhaustive-deps */
import { FileTextOutlined, MessageOutlined } from '@ant-design/icons'
import { Button, Input, Layout, List, Skeleton, Space, Typography } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'

import { useChatStore } from '~/services/state-manager/chat-store'

const { Sider } = Layout
const { Search } = Input

const SidebarAI = () => {
  const router = useRouter()
  const currentChatId = router.query['chat-id']

  const {
    chats,
    isLoading,
    searchTerm,
    fetchChats,
    setSearchTerm,
    setChatId,
    loadingMessages,
  } = useChatStore()

  useEffect(() => {
    fetchChats()
  }, [])

  const filteredChats = useMemo(() => {
    if (!searchTerm) return chats
    return chats.filter((chat) =>
      (chat.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [chats, searchTerm])

  return (
    <Sider
      width={300}
      className="bg-gray-dark"
      style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'auto' }}
    >
      <div style={{ marginBottom: 24 }}>
        <Button
          type="primary"
          block
          icon={<FileTextOutlined />}
          onClick={() => router.push('/monit-ai/new')}
        >
          New Chat
        </Button>
      </div>

      <Search
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <Typography.Title level={5} style={{ color: '#fff' }}>
        Recent Chats
      </Typography.Title>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} title={false} />
      ) : (
        <List
          size="small"
          dataSource={filteredChats}
          renderItem={(chat) => {
            const isSelected = currentChatId === chat.id

            return (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: 6,
                  marginBottom: 4,

                  backgroundColor: isSelected ? '#2a2f45' : 'transparent',
                }}
                onClick={() => {
                  if (loadingMessages !== '') return
                  setChatId(chat.id)
                  router.push(`/monit-ai/${chat.id}`)
                }}
              >
                <Space>
                  <MessageOutlined style={{ color: '#ccc' }} />
                  <Typography.Text
                    style={{ color: '#fff' }}
                    ellipsis
                    strong={isSelected}
                  >
                    {chat.title || `Chat ${chat.id.slice(0, 5)}...`}
                  </Typography.Text>
                </Space>
              </List.Item>
            )
          }}
        />
      )}
    </Sider>
  )
}

export default SidebarAI
