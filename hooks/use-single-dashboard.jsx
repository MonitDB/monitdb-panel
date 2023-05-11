import { useContext } from 'react'

import SingleDashboardContext from '~/contexts/single-dashboard'

export default function useSingleDashboard() {
  return useContext(SingleDashboardContext)
}
