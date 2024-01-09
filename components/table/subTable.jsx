/* eslint-disable react/no-children-prop */
/* eslint-disable no-unsafe-optional-chaining */

import { Button, Modal, Table } from 'antd'
import MarkdownIt from 'markdown-it'
import markdownItStyle from 'markdown-it-style'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import useAlertContext from '~/services/state-manager/alerts'

import Loading from '../loading/loading'

const md = new MarkdownIt()
md.use(markdownItStyle)

export const AlertHtmlSubTable = (properties) => {
  const { serverId, idSeq } = properties

  const { getAlertHtml, getSuggestion } = useAlertContext()

  const [html, setHtml] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingAI, setLoadingAI] = useState(false)
  const [modal, setModal] = useState(false)
  const [suggestion, setSuggestion] = useState('')

  const getHtml = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getAlertHtml(idSeq, serverId)
      setHtml(response)
    } catch {
      toast.error(
        `Error to get the HTML of ${idSeq} Alert, at Server ${serverId}\nIf problem persists, contact-us!`
      )
    } finally {
      setLoading(false)
    }
  }, [getAlertHtml, idSeq, serverId])

  const getAiSuggestion = async (serverId, alertId, htmlRow) => {
    try {
      setLoadingAI(true)
      const data = await getSuggestion(serverId, alertId, htmlRow)

      setSuggestion(data.result)
    } catch {
      toast.error(
        `Error to get the AI Suggestion of ${idSeq} Alert, at Server ${serverId}\nIf problem persists, contact-us!`
      )
    } finally {
      setLoadingAI(false)
    }
  }

  useEffect(getHtml, [getHtml])

  return (
    <>
      <Table
        dataSource={html}
        loading={loading}
        columns={[
          ...(html && html.length > 0
            ? Object.keys(html[0]).map((element, index) => ({
                dataIndex: element,
                key: index,
                title: element,
              }))
            : []),
          {
            key: 'suggestion',
            render: (value, record, index) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <Button
                  type="dashed"
                  size="small"
                  children={<>See how to fix</>}
                  onClick={() => {
                    setModal(true)
                    getAiSuggestion(serverId, idSeq, index)
                  }}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={modal}
        onClose={() => {
          setModal(false)
        }}
        height={500}
        width={800}
        style={{ minHeight: '600px' }}
        title="AI Result"
        closable={false}
        onOk={() => setModal(false)}
      >
        {loadingAI && (
          <div
            style={{
              marginTop: 0,
              marginBottom: 0,
              height: '500px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loading />
          </div>
        )}

        {!loadingAI && (
          <div
            className="markdown"
            dangerouslySetInnerHTML={{
              __html: md.render(suggestion),
            }}
          />
        )}
      </Modal>
    </>
  )
}
