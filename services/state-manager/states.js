import { create } from 'zustand'

import clientApi, { apiV2 } from '../../utils/client-api'

const useExecComponentContext = create(() => ({
  getVersions: async () => {
    return clientApi().get(`/api/execcomponent/PRVER`)
  },
  getBackups: async () => {
    return clientApi().get(`/api/execcomponent/prbackup`)
  },
  getDiskUsage: async () => {
    return clientApi().get(`/api/execcomponent/prdisks`)
  },
  getSqlServerLicensing: async () => {
    return apiV2().get(`/component/execute-component/prlcn`)
  },
  getSqlAgentRundeckJobs: async () => {
    return clientApi().get(`/api/execcomponent/prjobrd`)
  },
  getSqlAgentPRjobs: async () => {
    return clientApi().get(`/api/execcomponent/prjob`)
  },
  getSqlAgentPRjobsExe: async () => {
    return clientApi().get(`/api/execcomponent/prjobexe`)
  },
  getSqlAgentPRjobsSteps: async () => {
    return clientApi().get(`/api/execcomponent/prjobsteps`)
  },
}))

export default useExecComponentContext
