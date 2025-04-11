/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable sonarjs/no-empty-collection */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
import {
  ApiOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons'
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
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore] = useState(true)
  const containerReference = useRef(null)

  const router = useRouter()

  const chatId = router.query['chat-id'] || 'new'
  const isNew = chatId === 'new'

  const suggestions = []

  const { renameChat, fetchChats } = useChatStore()

  const loadPreviousMessages = async (chatId) => {
    if (isNew) return

    try {
      const { data = [] } = await apiV2().get(
        `ai/load-previous-messages/${chatId}`,
        {
          // params: { page },
        }
      )
      setMessages(data)
      scrollToBottom()
      // const newMessages = data.filter((msg) => !loadedMessageIds.has(msg.id))

      // if (newMessages.length > 0) {
      //   setMessages((previous) => [...newMessages.reverse(), ...previous])
      //   setLoadedMessageIds((prev) => {
      //     const updated = new Set(prev)
      //     for (const msg of newMessages) updated.add(msg.id)
      //     return updated
      //   })
      //   setPage((prev) => prev + 1)
      // } else {
      //   setHasMore(false)
      // }
    } catch {
      return
    }
  }

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

    const userMessage = { id: Date.now(), role: 'user', message: input.trim() }
    setMessages((previous) => [...previous, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let generatedChatId = chatId

      if (isNew) {
        const { data: createdChat } = await apiV2().post('ai/create-chat')
        generatedChatId = createdChat.id
        router.replace({
          pathname: router.pathname,
          query: { 'chat-id': generatedChatId },
        })

        const _ = async () => {
          await renameChat(generatedChatId, input.trim())

          await fetchChats()
        }
        _()
      }

      const loadingMessage = {
        id: `loading-${Date.now()}`,
        role: 'loading',
        message: '',
      }
      setMessages((previous) => [...previous, loadingMessage])

      const { data } = await apiV2().post('ai/completions', {
        chatId: generatedChatId,
        message: input.trim(),
      })

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message: data,
      }

      setMessages((previous) => {
        const updated = [...previous]
        const lastMessage = updated[updated.length - 1]

        if (lastMessage?.role === 'loading') {
          updated.pop()
        }

        return [...updated, assistantMessage]
      })
    } catch (error) {
      setMessages((previous) => {
        previous.pop()
        return [
          ...previous,
          { id: `error-${Date.now()}`, role: 'error', message: error.message },
        ]
      })
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
    setMessages((previous) => [...previous, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message: `Resposta gerada para: "${suggestionText}"`,
      }
      setMessages((previous) => [...previous, assistantMessage])
      setIsLoading(false)
      scrollToBottom()
    }, 1500)
  }

  const handleScroll = async () => {
    if (containerReference.current.scrollTop === 0 && hasMore) {
      const previousHeight = containerReference.current.scrollHeight
      await loadPreviousMessages(chatId)
      setTimeout(() => {
        const newHeight = containerReference.current.scrollHeight
        containerReference.current.scrollTop = newHeight - previousHeight
      }, 100)
    }
  }

  useEffect(() => {
    loadPreviousMessages(chatId)

    scrollToBottom()
  }, [router.query['chat-id']])

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Content
        style={{
          paddingLeft: '24px',
          background: '#f0f2f5',
          overflowY: 'hidden',
        }}
      >
        <div
          ref={containerReference}
          onScroll={handleScroll}
          style={{
            height: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
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
                style={{ height: '100%' }}
                renderItem={(message) => (
                  <List.Item
                    key={message.id}
                    style={{
                      justifyContent:
                        message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Space align="start">
                      {message.role === 'assistant' ||
                        (message.role === 'loading' && (
                          <Avatar icon={<RobotOutlined />} />
                        ))}
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
                        {message.role !== 'loading' && (
                          <Markdown
                            content={message.message.trim()}
                            className="prose"
                          />
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
      </Content>

      <Footer style={{ padding: 12, width: '100%' }}>
        <div style={{ width: '100%', padding: '0 30%' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <Input.TextArea
              style={{ flex: 1, marginRight: 8 }}
              placeholder="Write your message..."
              value={input}
              rows={2}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              role="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={isLoading}
            />
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default ChatAI
