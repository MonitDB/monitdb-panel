import  { apiV2 } from '~/utils/client-api'

export const getVersions = async () => {
  return apiV2().get(`/component/execute-component/PRVER`)
}

export const getBackups = async () => {
  return apiV2().get(`/states/backups`)
}

export const getBackupsFromDatabase = async (serverId,databaseName, startDate, endDate) => {
  return apiV2().get(`/states/backups/${serverId}`, { params: {startDate,databaseName, endDate}})
}


export const getDiskUsage = async () => {
  return apiV2().get(`/states/disks`)
}

export const getSqlServerLicensing = async () => {
  return apiV2().get(`/component/execute-component/prlcn`)
}

export const getSqlAgentRundeckJobs = async () => {
  return apiV2().get(`/component/execute-component/prjobrd`)
}

export const getSqlAgentPRjobs = async () => {
  return apiV2().get(`/component/execute-component/prjob`)
}

export const getSqlAgentPRjobsExe = async (serverId, parameters) => {
  return apiV2().get(`/states/jobs-execution/${serverId}`, { params: parameters})
}

export const getSqlAgentPRjobsExecutions = async (serverId, parameters) => {
  return apiV2().get(`/states/jobs-executions/${serverId}`, { params: parameters})
}

export const getSqlAgentPRjobsSteps = async () => {
  return apiV2().get(`/component/execute-component/prjobsteps`)
}
