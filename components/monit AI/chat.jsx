/* eslint-disable no-extra-semi */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable sonarjs/no-empty-collection */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
import { ApiOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Input,
  Layout,
  List,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import { useChatStore } from '~/services/state-manager/chat-store'
import { apiV2 } from '~/utils/client-api'

import { Markdown } from '../md'

const { Content, Footer } = Layout

const ChatAI = () => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const containerReference = useRef(null)

  const router = useRouter()

  const chatId = router.query['chat-id'] || 'new'
  const isNew = chatId === 'new'

  const suggestions = []

  const {
    renameChat,
    setChats,
    loadPreviousMessages,
    messages,
    setMessages,
    chats,
    chatId: currentChatId,
    loadingMessages,
  } = useChatStore()
  const scrollToBottom = () => {
    setTimeout(() => {
      if (containerReference.current) {
        containerReference.current.scrollTop =
          containerReference.current.scrollHeight
      }
    }, 100)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    try {
      let generatedChatId = chatId
      setInput('')
      setIsLoading(true)
      const loadingMessage = {
        id: `loading-${Date.now()}`,
        role: 'loading',
        message: '',
      }

      const userMessage = {
        id: Date.now(),
        role: 'user',
        message: input,
      }
      setMessages([...messages, userMessage, loadingMessage])
      if (isNew) {
        setMessages([userMessage, loadingMessage])
        const { data: createdChat } = await apiV2().post('ai/create-chat')
        generatedChatId = createdChat.id
        renameChat(generatedChatId, input.trim())
        router.replace({
          pathname: router.pathname,
          query: { 'chat-id': generatedChatId },
        })
      }

      const { data } = await apiV2().post('ai/completions', {
        chatId: generatedChatId,
        message: input.trim(),
      })

      if (isNew) {
        setChats([{ id: generatedChatId, title: input.trim() }, ...chats])
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message: data,
      }

      const updated = [...messages]
      const lastMessage = updated[updated.length - 1]

      if (lastMessage?.role === 'loading') {
        updated.pop()
      }

      setMessages([...updated, assistantMessage])
    } catch (error) {
      setMessages([
        ...messages,
        { id: `error-${Date.now()}`, role: 'error', message: error.message },
      ])
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }

  const handleSuggestionClick = (suggestionText) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      message: suggestionText,
    }
    setMessages([...messages, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message: `Resposta gerada para: "${suggestionText}"`,
      }
      setMessages([...messages, assistantMessage])
      setIsLoading(false)
      scrollToBottom()
    }, 1500)
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      await loadPreviousMessages()
      setIsLoading(false)
      scrollToBottom()
    })()
  }, [currentChatId])

  const isLoadingCurrentChatMessages = loadingMessages === chatId

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Content
        style={{
          overflowY: 'hidden',
          height: '100%',
        }}
      >
        {isLoadingCurrentChatMessages && (
          <div
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '80vh',
              padding: '0 15%',
              background: 'rgba(255, 255, 255, 0)',
            }}
          >
            <br />
            <Skeleton />
            <br />
            <Skeleton />
            <br />
            <Skeleton />
          </div>
        )}
        {!isLoadingCurrentChatMessages && (
          <div
            ref={containerReference}
            style={{
              height: 'calc(100vh - 200px)',
              overflowY: 'auto',
              display: 'flex',

              flexDirection: 'column',
              scrollBehavior: 'smooth',
            }}
          >
            {isNew && (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <Space direction="vertical">
                  <Typography.Title level={3}>
                    What can I help with?
                  </Typography.Title>
                  <Space wrap style={{ justifyContent: 'center' }}>
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        role="default"
                        style={{ borderRadius: 20 }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </Space>
                </Space>
              </div>
            )}

            {!isNew && (
              <>
                <List
                  dataSource={messages}
                  style={{
                    height: '100%',
                    paddingTop: 16,
                    overflow: 'auto',
                    padding: '0 15%',
                  }}
                  renderItem={(message) => (
                    <List.Item
                      key={message.id}
                      style={{
                        justifyContent:
                          message.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Space align="start">
                        {(message.role === 'assistant' ||
                          message.role === 'loading') && (
                          <Avatar icon={<RobotOutlined />} />
                        )}

                        {message.role === 'error' && (
                          <Avatar icon={<ApiOutlined />} />
                        )}
                        <div
                          style={{
                            background:
                              message.role === 'user' ? '#5046e5' : '#fff',
                            borderRadius: 8,
                            padding: '8px 12px',
                            maxWidth: 400,
                            color: message.role === 'user' ? '#fff' : '#000',
                          }}
                        >
                          {message.role !== 'user' &&
                            message.role !== 'loading' && (
                              <Markdown
                                content={message.message.trim()}
                                className="prose"
                              />
                            )}

                          {message.role === 'user' && (
                            <p
                              style={{
                                color: '#fff',
                              }}
                            >
                              {message.message.trim()}
                            </p>
                          )}

                          {message.role === 'loading' && (
                            <Skeleton
                              active
                              paragraph={{ rows: 1 }}
                              title={false}
                              style={{ marginLeft: 10, width: 300 }}
                            />
                          )}
                        </div>
                        {message.role === 'user' && (
                          <Avatar icon={<UserOutlined />} />
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
      </Content>
      {!isLoadingCurrentChatMessages && (
        <Footer style={{ padding: 12, width: '100%' }}>
          <div style={{ width: '100%', padding: '0 20%' }}>
            <div style={{ display: 'flex', width: '100%' }}>
              <Input.TextArea
                style={{ flex: 1 }}
                placeholder="Write your message..."
                value={input}
                disabled={isLoading}
                size="large"
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              {/* <Button
                role="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={isLoading}
              /> */}
            </div>
          </div>
        </Footer>
      )}
    </Layout>
  )
}

export default ChatAI
