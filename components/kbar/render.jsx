import { KBarResults, useMatches } from 'kbar'

import ResultItem from './Components/ResultItem'

function RenderResults() {
  const { results } = useMatches()

  return (
    <KBarResults
      items={results}
      maxHeight={500}
      className="overflow-y-auto"
      onRender={({ item, active }) => {
        return typeof item === 'string' ? (
          <div className="py-3 px-5">
            <h2 className="text-center uppercase">{item}</h2>
          </div>
        ) : (
          <ResultItem action={item} active={active} />
        )
      }}
    />
  )
}

export default RenderResults
