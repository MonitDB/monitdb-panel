import 'html-query-plan/css/qp.css'

import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledQueryPlanRendererContainer = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`

const QueryPlanRenderer = ({ queryPlan }) => {
  const containerReference = useRef(null)

  useEffect(() => {
    const loadQP = async () => {
      const QP = await import('html-query-plan')

      const options = {}

      if (
        QP &&
        QP.showPlan &&
        typeof QP.showPlan === 'function' &&
        containerReference.current
      ) {
        try {
          QP.showPlan(containerReference.current, queryPlan, options)
        } catch {
          /* empty */
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('QP.showPlan is not available or container is not found')
      }
    }

    loadQP()
  }, [queryPlan])

  return (
    <StyledQueryPlanRendererContainer>
      <div ref={containerReference} id="qpRender" />
    </StyledQueryPlanRendererContainer>
  )
}

export default QueryPlanRenderer
