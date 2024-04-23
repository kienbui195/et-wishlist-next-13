import * as React from 'react'
import  Link  from 'next/link'

const NotFound = () => {
  return (
    <div className="nc-Page404">
      <div className="container relative py-16 lg:py-20">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto space-y-7 flex flex-col items-stretch">
          <h2 className="text-7xl md:text-8xl">🪔</h2>
          <h1 className="text-8xl md:text-9xl font-semibold tracking-widest">
            404
          </h1>
          <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
            {`THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.`}
          </span>
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex mt-4 h-[50px] items-center justify-center rounded-md bg-[--brand-primary] px-6 hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-pressed]"
              tabIndex={-1}
            >
              <span className="text-lg font-semibold text-white">
                Return Home Page
              </span>
            </Link>
          </div>
        </header>
      </div>
    </div>
  )
}

export default NotFound
