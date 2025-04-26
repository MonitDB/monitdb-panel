/* eslint-disable no-extra-semi */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable sonarjs/no-empty-collection */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
import {
  ApiOutlined,
  PauseOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
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

const { Content } = Layout

const ChatAI = () => {
  const router = useRouter()

  const { query, pathname } = router

  const base64ToString = query?.query
    ? Buffer.from(query.query, 'base64').toString('utf8')
    : ''

  const [input, setInput] = useState(base64ToString ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const containerReference = useRef(null)
  const controllerReference = useRef(null)

  // eslint-disable-next-line unicorn/consistent-destructuring
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

  useEffect(() => {
    if (isNew && query.query) {
      handleSend()
    }
  }, [isNew, query.query])

  const handleSend = async () => {
    if (!input.trim()) return

    let controller = new AbortController()
    controllerReference.current = controller

    const userMessage = {
      id: Date.now(),
      role: 'user',
      message: input.trim(),
    }

    const loadingMessage = {
      id: `loading-${Date.now()}`,
      role: 'loading',
      message: '',
    }

    let generatedChatId = chatId
    const initialMessages = isNew
      ? [userMessage, loadingMessage]
      : [...(messages || []), userMessage, loadingMessage]

    setMessages(initialMessages)
    setInput('')
    setIsLoading(true)

    try {
      if (isNew) {
        const { data: createdChat } = await apiV2().post(
          'ai/create-chat',
          {},
          {
            signal: controllerReference.current.signal,
          }
        )
        generatedChatId = createdChat.id

        renameChat(generatedChatId, input.trim())
        router.replace({
          pathname: pathname,
          query: { 'chat-id': generatedChatId },
        })

        setChats([{ id: generatedChatId, title: input.trim() }, ...chats])
      }

      const { data } = await apiV2().post(
        'ai/completions',
        {
          chatId: generatedChatId,
          message: input.trim(),
        },
        {
          signal: controllerReference.current.signal,
        }
      )

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message: data.aiResponse,
      }

      setMessages((prev) => {
        return isNew
          ? [userMessage, assistantMessage]
          : [
              ...(prev || []).filter((m) => m.role !== 'loading'),
              assistantMessage,
            ]
      })
    } catch (error) {
      setMessages((prev) => [
        ...(prev || []).filter((m) => m.role !== 'loading'),
        {
          id: `error-${Date.now()}`,
          role: 'error',
          message: error.message + ' ' + (error?.response?.data?.message ?? ''),
        },
      ])
    } finally {
      setInput('')
      setIsLoading(false)
      scrollToBottom()
    }
  }

  const handleStop = async () => {
    if (controllerReference.current) {
      controllerReference.current.abort()
      controllerReference.current = undefined
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
          display: `${isNew ? 'flex' : 'block'}`,
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {isLoadingCurrentChatMessages && (
          <div
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '70vh',
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
              height: `${isNew ? '' : 'calc(100vh - 270px)'}`,
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
                            message.role !== 'loading' &&
                            message.role !== 'error' && (
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

                          {message.role === 'error' && (
                            <p
                              style={{
                                color: 'red',
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
        <div style={{ width: '100%', padding: '1.2rem 20% 0 20%' }}>
          <Card hoverable variant="borderless">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <Input.TextArea
                style={{ flex: 1 }}
                variant="borderless"
                placeholder="Write your message..."
                value={input}
                // disabled={isLoading}
                size="large"
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey && !isLoading) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                style={{ marginLeft: 'auto' }}
                role="primary"
                icon={isLoading ? <PauseOutlined /> : <SendOutlined />}
                onClick={isLoading ? handleStop : handleSend}
              />
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

export default ChatAI
