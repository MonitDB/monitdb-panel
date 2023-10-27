import React from 'react'

import { PageContent } from '~/components/page'
import Jobs from '~/components/page/states/sql-agent-jobs/jobs'
// import JobsRundeck from '~/components/page/states/sql-agent-jobs/rundeck-jobs'

const SqlAgentJobs = () => {
  return (
    <PageContent removeSidebarMargin className="pt-16 space-y-10">
      <Jobs />
      {/* <JobsRundeck /> */}
    </PageContent>
  )
}

export default SqlAgentJobs
