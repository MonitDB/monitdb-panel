import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'

import { PAGINATION_DOTS, usePagination } from './use-pagination'

const Pagination = ({
  currentPage = 1,
  // totalPages = 1,
  onChangePage = () => {},
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount: 100,
    siblingCount: 1,
    pageSize: 10,
  })

  const onNext = useCallback(() => {
    onChangePage(currentPage + 1)
  }, [onChangePage, currentPage])

  const onPrevious = useCallback(() => {
    onChangePage(currentPage - 1)
  }, [onChangePage, currentPage])

  const lastPage = useMemo(
    () => paginationRange[paginationRange.length - 1],
    [paginationRange]
  )

  if (currentPage === 0 || paginationRange.length < 2) {
    return
  }

  return (
    <div className="flex justify-end space-x-1">
      <button
        type="button"
        className={classNames('mr-1 text-sm', {
          'text-gray-light cursor-default': currentPage === 1,
          'text-gray-dark lg:hover:opacity-50': currentPage !== 1,
        })}
        onClick={onPrevious}
      >
        <FontAwesomeIcon icon={faArrowRight} className="transform rotate-180" />
      </button>

      {paginationRange.map((pageNumber) => {
        if (pageNumber === PAGINATION_DOTS) {
          return (
            <span
              key={`pagination-dots-${pageNumber}`}
              className="block py-1 px-2 text-xs text-gray-dark"
            >
              &#8230;
            </span>
          )
        }

        return (
          <button
            key={`pagination-${pageNumber}`}
            type="button"
            className={classNames(
              `block py-1 px-2 text-xs text-gray-dark
            lg:hover:bg-gray-dark lg:hover:text-white rounded`,
              {
                'bg-gray-dark text-white': pageNumber === currentPage,
              }
            )}
            onClick={() => onChangePage(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      })}

      <button
        type="button"
        className={classNames('ml-1 text-sm', {
          'text-gray-light cursor-default': currentPage === lastPage,
          'text-gray-dark lg:hover:opacity-50': currentPage !== lastPage,
        })}
        onClick={onNext}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  )
}

export default Pagination
