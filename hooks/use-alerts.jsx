import { useContext } from 'react'

import AlertsContext from '~/contexts/alerts'

export default function useAlerts() {
  return useContext(AlertsContext)
}
