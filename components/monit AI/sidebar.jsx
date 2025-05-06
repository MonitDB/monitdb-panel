/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  FileTextOutlined,
  LoadingOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import {
  Button,
  Input,
  Layout,
  List,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'

import { useChatStore } from '~/services/state-manager/chat-store'
import { truncateString } from '~/utils/truncateString'

const { Sider } = Layout

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
    deleteChat,
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

      <Input
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            magin: 'auto',
          }}
        >
          <Spin size="large" indicator={<LoadingOutlined spin />} />
        </div>
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
                    {truncateString(
                      chat.title || `Chat ${chat.id.slice(0, 5)}...`,
                      25
                    )}
                  </Typography.Text>
                </Space>
                <Popconfirm
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                  title="Delete the chat"
                  description="Are you sure to delete this chat?"
                  onConfirm={(event) => {
                    event.stopPropagation()
                    deleteChat(chat.id)
                    router.push('/monit-ai/new')
                  }}
                  okText="Yes"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    type="text"
                    size="small"
                    danger
                  />
                </Popconfirm>
              </List.Item>
            )
          }}
        />
      )}
    </Sider>
  )
}

export default SidebarAI
