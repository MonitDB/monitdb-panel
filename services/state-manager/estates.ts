import { create } from 'zustand'

import clientApi from '../../utils/client-api'

interface ExecComponentContext {
  getVersions: () => Promise<any>
  getBackups: () => Promise<any>
  getDiskUsage: () => Promise<any>
  getSqlServerLicensing: () => Promise<any>
  getSqlAgentRundeckJobs: () => Promise<any>
  getSqlAgentPRjobs: () => Promise<any>
  getSqlAgentPRjobsExe: () => Promise<any>
  getSqlAgentPRjobsSteps: () => Promise<any>
}

const useExecComponentContext = create<ExecComponentContext>((set, get) => ({
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
    return clientApi().get(`/api/execcomponent/prlcn`)
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
