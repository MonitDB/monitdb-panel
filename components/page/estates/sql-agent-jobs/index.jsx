import React from 'react'

import Jobs from '~/components/page/estates/sql-agent-jobs/jobs'
import JobsRundeck from '~/components/page/estates/sql-agent-jobs/rundeck-jobs'
import { PageContent } from '~/components/page'

const SqlAgentJobs = () => {
  return (
    <PageContent removeSidebarMargin className="pt-16 space-y-10">
      <Jobs />
      <JobsRundeck />
    </PageContent>
  )
}

export default SqlAgentJobs
