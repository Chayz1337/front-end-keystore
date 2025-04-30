import { EnumProductSort } from "@/src/assets/styles/services/product/product.types"
import { FC, useState } from "react"

interface ISortDropdown {
  sortType: EnumProductSort
  setSortType: (value: EnumProductSort) => void
}

const SortDropdown: FC<ISortDropdown> = ({ sortType, setSortType }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    // Переключаем wrapper в inline-block, чтобы dropdown был шириной кнопки
    <div className="relative inline-block text-left mb-5 font-bold">
      {/* Кнопка с иконкой стрелочки */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex items-center justify-between w-full py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm
                   transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50"
      >
        <span>Sort by: {sortType}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Выпадающий список */}
      <div
        className={
          "absolute left-0 top-full z-10 mt-1 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg " +
          "transition-all duration-200 ease-in-out overflow-hidden " +
          (isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0")
        }
      >
        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
          {(Object.keys(EnumProductSort) as Array<keyof typeof EnumProductSort>).map((key) => {
            const value = EnumProductSort[key]
            return (
              <li key={key}>
                <button
                  onClick={() => {
                    setSortType(value)
                    setIsOpen(false)
                  }}
                  className="w-full text-left py-2 px-4 hover:bg-gray-100 focus:bg-gray-100 transition-colors duration-150"
                >
                  {value}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SortDropdown
