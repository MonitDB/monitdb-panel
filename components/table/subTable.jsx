import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import useAlertContext from '~/services/state-manager/alerts'
import { paginateArray } from '~/utils/array'

import Loading from '../loading/loading'
import Pagination from '../pagination/pagination'

export const AlertHtmlSubTable = (properties) => {
  const { serverId, idSeq } = properties

  const { getAlertHtml } = useAlertContext()

  const [currentSubPage, setCurrentSubPage] = useState(1)
  const [html, setHtml] = useState([])
  const [loading, setLoading] = useState(false)

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
            </thead>
            <tbody>
              {paginateArray(html, currentSubPage, 10).map((element, index) => (
                <tr key={index}>
                  {Object?.values(element).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
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
          </table>
        )}
      </td>
    </tr>
  )
}
