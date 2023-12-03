import MarkdownIt from 'markdown-it'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import useAlertContext from '~/services/state-manager/alerts'
import { paginateArray } from '~/utils/array'

import Button from '../Button'
import Loading from '../loading/loading'
import Modal from '../modal/modal'
import Pagination from '../pagination/pagination'
import SuggestionButton from '../suggestionButton'
import TerminalWindow from '../terminal'
const md = new MarkdownIt()

export const AlertHtmlSubTable = (properties) => {
  const { serverId, idSeq } = properties

  const { getAlertHtml, getSuggestion } = useAlertContext()

  const [currentSubPage, setCurrentSubPage] = useState(1)
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

  if (loading)
    return (
      <tr>
        <td colSpan={5}>
          <div
            style={{
              marginTop: 0,
              marginBottom: 0,
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loading />
          </div>
        </td>
      </tr>
    )

  return (
    <tr>
      <td colSpan={5}>
        {html[0] && (
          <table style={{ marginTop: 0 }}>
            <thead>
              <tr>
                {Object?.keys(html[0]).map((element, index) => (
                  <th key={index}>{element}</th>
                ))}
              </tr>
              <tr></tr>
            </thead>
            <tbody>
              {paginateArray(html, currentSubPage, 10).map((element, index) => (
                <tr key={index}>
                  {Object?.values(element).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                  <td>
                    <SuggestionButton
                      onClick={() => {
                        setModal(true)
                        getAiSuggestion(
                          serverId,
                          idSeq,
                          (currentSubPage - 1) * 10 + index
                        )
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            {html.length > 10 && (
              <Pagination
                currentPage={currentSubPage}
                totalResults={html.length}
                onChangePage={(page) => setCurrentSubPage(page)}
              />
            )}
            <Modal
              visible={modal}
              onClose={() => {
                setModal(false)
              }}
              width="60%"
              height="50%"
              title="AI Result"
              closable={false}
              footer={
                <>
                  <Button onClick={() => setModal(false)} type={'secondary'}>
                    Close
                  </Button>
                </>
              }
            >
              {loadingAI && (
                <div
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    height: '100%',
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
                  dangerouslySetInnerHTML={{
                    __html: md.render(suggestion),
                  }}
                />
              )}
            </Modal>
          </table>
        )}
      </td>
    </tr>
  )
}
