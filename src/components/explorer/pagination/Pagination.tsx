import React, { FC } from 'react'
import Button from '../../ui/button/Button'

interface IPagination {
  numberPages: number
  changePage: (page: string) => void
  currentPage?: number | string
}

const Pagination: FC<IPagination> = ({
  numberPages,
  changePage,
  currentPage,
}) => {
  return (
    <div className='text-center mt-16'>
      {Array.from({ length: numberPages > 1 ? numberPages : 1 }).map((_, index) => {
        const pageNumber = (index + 1).toString()
        const isActive = currentPage === pageNumber

        return (
          <Button
            key={pageNumber}
            variant={isActive ? 'orange' : 'white'}
            onClick={() => changePage(pageNumber)}
            className='mx-3'
            disabled={isActive}
          >
            {pageNumber}
          </Button>
        )
      })}
    </div>
  )
}

export default Pagination
