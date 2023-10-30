import clientApi, { apiV2 } from '~/utils/client-api'

export const getVersions = async () => {
  return clientApi().get(`/api/execcomponent/PRVER`)
}

export const getBackups = async () => {
  return clientApi().get(`/api/execcomponent/prbackup`)
}

export const getDiskUsage = async () => {
  return apiV2().get(`/states/disks`)
}

export const getSqlServerLicensing = async () => {
  return clientApi().get(`/api/execcomponent/prlcn`)
}

export const getSqlAgentRundeckJobs = async () => {
  return clientApi().get(`/api/execcomponent/prjobrd`)
}

export const getSqlAgentPRjobs = async () => {
  return clientApi().get(`/api/execcomponent/prjob`)
}

export const getSqlAgentPRjobsExe = async (serverId, parameters) => {
  return apiV2().get(`/states/jobs-execution/${serverId}`, { params: parameters})
}

export const getSqlAgentPRjobsSteps = async () => {
  return clientApi().get(`/api/execcomponent/prjobsteps`)
}
