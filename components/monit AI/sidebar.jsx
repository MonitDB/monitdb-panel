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
      {/* Onda visual: o unico botao solido em indigo do ecra passa a ser o de
          enviar. Aqui fica contorno, com o indigo claro (#8b8cf6) que e o que
          passa contraste sobre o #161b22 da barra lateral — o #5046e5 fica em
          2,9:1 sobre esse fundo e nao se ve. O caixote do lixo sai da lista e
          so aparece em hover/foco. */}
      <style>{`
        .ai-new-chat.ant-btn {
          background: transparent;
          border-color: #8b8cf6;
          color: #8b8cf6;
        }
        .ai-new-chat.ant-btn:hover,
        .ai-new-chat.ant-btn:focus-visible {
          background: rgba(139, 140, 246, 0.12);
          border-color: #8b8cf6;
          color: #fff;
        }
        .ai-chat-item .ai-chat-delete {
          opacity: 0;
          transition: opacity 120ms ease-in-out;
        }
        .ai-chat-item:hover .ai-chat-delete,
        .ai-chat-item:focus-within .ai-chat-delete {
          opacity: 1;
        }
      `}</style>
      <div style={{ marginBottom: 24 }}>
        <Button
          className="ai-new-chat"
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
                className="ai-chat-item"
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: 6,
                  marginBottom: 4,
                  borderLeft: `3px solid ${
                    isSelected ? '#8b8cf6' : 'transparent'
                  }`,
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
                    className="ai-chat-delete"
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
