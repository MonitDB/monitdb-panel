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
import { APIV2,apiV2 } from '~/utils/client-api'
import { apiLocalLLM } from '~/utils/client-api-local-llm'
import { getUserToken } from '~/utils/cookies'

import { Markdown } from '../md'

const { Content } = Layout

// Lê o stream SSE (data: {...}\n\n) e despacha por tipo de evento.
async function consumeSSEStream(response, { onDelta, onStatus, onDone }) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let reading = true
  while (reading) {
    const { value, done } = await reader.read()
    if (done) {
      reading = false
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop()
    for (const part of parts) {
      const line = part.trim()
      if (!line.startsWith('data:')) continue
      const ev = JSON.parse(line.slice(5).trim())
      switch (ev.type) {
        case 'delta':
          onDelta(ev.text)
          break
        case 'status':
          onStatus(ev.text)
          break
        case 'done':
          onDone(ev)
          break
        case 'error':
          throw new Error(ev.message)
        default:
          break
      }
    }
  }
}

const ChatAI = () => {
  const router = useRouter()
  const { query, pathname } = router

  // const  = JSON.parse(localStorage.getItem('app:usingRemoteLLMs')) ?? false;
  const usingRemoteLLMs = true;

  const [input, setInput] = useState('')
  const [hasHandledURLQuery, setHasHandledURLQuery] = useState(false)
  const [sessionUsage, setSessionUsage] = useState()
  const containerReference = useRef(null)
  const controllerReference = useRef(null)

  // Resumo de uso/custo da sessão (tokens + custo estimado)
  const loadSessionUsage = async (id) => {
    if (!id || id === 'new') return
    try {
      const { data } = await apiV2().get(`ai/usage/${id}`)
      setSessionUsage(data)
    } catch {
      // silencioso: o resumo é informativo
    }
  }

  // eslint-disable-next-line unicorn/consistent-destructuring
  const chatId = router.query['chat-id'] || 'new'
  const isNew = chatId === 'new'

  const suggestions = []

  const {
    renameChat,
    loadPreviousMessages,
    messages,
    setMessages,
    fetchChats,
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
    if (isNew && query.query && !hasHandledURLQuery) {
      const base64ToString = Buffer.from(query.query, 'base64').toString('utf8')
      setInput(base64ToString)
      setHasHandledURLQuery(true)
      handleSend(base64ToString)
    }
  }, [isNew, query.query, hasHandledURLQuery])

  // STREAMING: cria a bolha do assistente e a preenche token a token.
  const streamRemoteCompletion = async (genChatId, text, controller) => {
    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...(prev || []).filter((m) => m.role !== 'loading'),
      { id: assistantId, role: 'assistant', message: '', streaming: true },
    ])
    const updateBubble = (patch) =>
      setMessages((prev) =>
        (prev || []).map((m) => (m.id === assistantId ? { ...m, ...patch } : m))
      )

    const token = getUserToken()
    const response = await fetch(`${APIV2}/ai/completions/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.apiKey,
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ chatId: genChatId, message: text }),
      signal: controller.signal,
    })
    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}`)
    }

    let acc = ''
    let done
    await consumeSSEStream(response, {
      onDelta: (t) => {
        acc += t
        updateBubble({ message: acc })
      },
      onStatus: (t) => updateBubble({ message: acc || `_${t}_` }),
      onDone: (ev) => {
        done = ev
      },
    })

    updateBubble({
      message: done?.message ?? acc,
      role: done?.role || 'assistant',
      totalTokens: done?.totalTokens,
      cost: done?.cost,
      streaming: false,
    })
    loadSessionUsage(genChatId)
  }

  const handleSend = async (messageToSend) => {
    const inputMessage = String(messageToSend || input || '')

    if (!inputMessage?.trim()) return

    let controller = new AbortController()
    controllerReference.current = controller

    const userMessage = {
      id: Date.now(),
      role: 'user',
      message: inputMessage.trim(),
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

    try {
      if (isNew) {
        router.replace({
          pathname: pathname,
          query: { 'chat-id': Date.now() },
        })
        const { data: createdChat } = await apiV2().post(
          'ai/create-chat',
          {},
          {
            signal: controller.signal,
          }
        )

        generatedChatId = createdChat.id

        renameChat(generatedChatId, inputMessage.trim()).then(fetchChats)
        router.replace({
          pathname: pathname,
          query: { 'chat-id': generatedChatId },
        })
      }

      if (usingRemoteLLMs) {
        await streamRemoteCompletion(generatedChatId, inputMessage.trim(), controller)
      } else {
        const { data } = await apiLocalLLM.post(
          `llm/${process.env.localLLMCollectionName}/chat`,
          {
            prompt: inputMessage.trim(),
            model: 'llama3.1:8b',
          }
        )
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: data.choices[0].message.role,
          message: data.choices[0].message.content,
          totalTokens: data.usage.totalTokens,
        }
        setMessages((prev) =>
          isNew
            ? [userMessage, assistantMessage]
            : [...(prev || []).filter((m) => m.role !== 'loading'), assistantMessage]
        )
      }
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

    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message: `Resposta gerada para: "${suggestionText}"`,
      }
      setMessages([...messages, assistantMessage])
      scrollToBottom()
    }, 1500)
  }

  useEffect(() => {
    ;(async () => {
      await loadPreviousMessages()
      scrollToBottom()
    })()
    loadSessionUsage(chatId)
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
        {!isNew && sessionUsage && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              padding: '6px 0',
              fontSize: 12,
              color: '#888',
              borderBottom: '1px solid #f0f0f0',
            }}
            title="Uso desta sessão. Custo histórico é estimado a partir do total de tokens."
          >
            <span>💬 {sessionUsage.messageCount} msgs</span>
            <span>🔢 {Number(sessionUsage.totalTokens || 0).toLocaleString('pt-BR')} tokens</span>
            <span>
              💲 ~US$ {Number(sessionUsage.estimatedCost || 0).toFixed(4)}
            </span>
            {sessionUsage.model && <span>🤖 {sessionUsage.model}</span>}
          </div>
        )}
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
                    width: '100%',
                  }}
                  renderItem={(message) => (
                    <List.Item
                      key={message.id}
                      style={{
                        justifyContent:
                          message.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '1000px',
                        margin: '0 auto',
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
                          className="message-bubble"
                          style={{
                            position: 'relative',
                            background:
                              message.role === 'user' ? '#5046e5' : '#fff',
                            borderRadius: 8,
                            padding: '8px 12px',
                            maxWidth: '100%',
                            margin: '0 0 10px 0',
                            color: message.role === 'user' ? '#fff' : '#000',
                          }}
                        >
                          {message.role === 'assistant' && (
                            <Markdown
                              content={message.message.trim()}
                              className="prose"
                            />
                          )}

                          {message.role === 'user' && (
                            <p style={{ color: '#fff', margin: 0 }}>
                              {message.message.trim()}
                            </p>
                          )}

                          {message.role === 'error' && (
                            <p style={{ color: 'red', margin: 0 }}>
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

                          <div id="toolbar">
                            {message.totalTokens && (
                              <Typography.Text
                                type="secondary"
                                style={{
                                  position: 'absolute',
                                  bottom: -18,
                                  right: 0,
                                  fontSize: 10,
                                  display: 'none',
                                }}
                                className="token-count"
                              >
                                {message.totalTokens} tokens
                              </Typography.Text>
                            )}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <Avatar icon={<UserOutlined />} />
                        )}
                      </Space>

                      <style>{`
                        .message-bubble:hover .token-count {
                          display: block !important;
                        }
                      `}</style>
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
                size="large"
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey && !isLoadingCurrentChatMessages) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                style={{ marginLeft: 'auto' }}
                role="primary"
                icon={
                  isLoadingCurrentChatMessages ? (
                    <PauseOutlined />
                  ) : (
                    <SendOutlined />
                  )
                }
                onClick={() =>
                  isLoadingCurrentChatMessages ? handleStop() : handleSend()
                }
              />
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

export default ChatAI
