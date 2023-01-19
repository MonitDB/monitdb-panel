import { useContext } from 'react'

import UserContext from '~/contexts/users'

export default function useUser() {
  return useContext(UserContext)
}
