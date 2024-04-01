export const FeatureFunction = {
  SCROLL_BAR: 1008,
  BLOCKING_PROCESS_TOP_10_BY_TIME: 1123,
  CPU: 1102,
  DASHBOARD: 1000,
  DATABASES: 1126,
  ERROR_LOG: 1125,
  DISK_SPACE: 1006,
  REFRESH_FREQUENCY: 1101,
  FILTERS: 1001,
  SERVER_INFORMATION: 1100,
  INSTANCES: 1002,
  LATCHES_AND_LOCKS_AVG_LATCH_WAIT: 1112,
  LATCHES_AND_LOCKS_LOCKS_TIMEOUTS_SEC: 1113,
  LATCHES_AND_LOCKS_LOCKS_WAITS_SEC: 1114,
  MEMORY: 1103,
  OS_PROPERTIES: 1117,
  PERMISSIONS: 1116,
  SP_BLITZ: 1400,
  SP_BLITZ_BACKUP: 1402,
  SP_BLITZ_FIRST: 1403,
  SP_BLITZ_INDEX: 1404,
  SP_BLITZ_LOCK: 1405,
  SP_BLITZ_QUERY_STORE: 1406,
  SP_BLITZ_WHO: 1407,
  SP_BLITZ_ANALYSIS: 1401,
  SQL_PROPERTIES: 1115,
}

export const TypeGrant = {
  DENY: 0,
  READ: 1,
  EXECUTE: 2,
  WRITE: 3,
  DELETE: 4,
  OWNER: 5,
}

export function hasPermission(user, featureFunction, typeGrant) {
  const grants = user.grants

  const grant = grants.find(
    (grant) => grant.idFeatureFunction === featureFunction
  )

  return Number(grant?.typeGrant ?? 1) >= typeGrant
}
