import { EnumProductSort } from "@/src/assets/styles/services/product/product.types"
import { FC, useState } from "react"

// Объект с русскими названиями для сортировки
const sortLabels: { [key in EnumProductSort]: string } = {
  [EnumProductSort.HIGH_PRICE]: "по убыванию цены",
  [EnumProductSort.LOW_PRICE]: "по возрастанию цены",
  [EnumProductSort.NEWEST]: "по новизне",
  [EnumProductSort.OLDEST]: "по давности",
}

interface ISortDropdown {
  sortType: EnumProductSort
  setSortType: (value: EnumProductSort) => void
}

const SortDropdown: FC<ISortDropdown> = ({ sortType, setSortType }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Базовые классы для выпадающего меню
  const baseDropdownClasses = 
    "absolute left-0 top-full z-50 mt-2 w-full min-w-[220px] " + // Увеличил mt, добавил min-width
    "bg-while rounded-md shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden"; // Более выразительная тень, тонкое кольцо-обводка, стандартное скругление
  
  // Классы для анимации
  const transitionClasses = "transition-all duration-200 ease-in-out"; // Анимируем всё для плавности

  // Условные классы для состояния открыто/закрыто
  const stateClasses = isOpen 
    ? "opacity-100 transform scale-100 visible" 
    : "opacity-0 transform scale-95 invisible"; // Добавил scale для "всплывающего" эффекта

  return (
    // mb-5 для отступа снизу, font-bold для текста кнопки (если это глобальный стиль для компонента)
    <div className="relative inline-block text-left mb-5"> 
      {/* Кнопка с иконкой стрелочки */}
      <button
        type="button" // Явно указываем тип кнопки
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex items-center justify-between w-full py-2.5 px-4 text-m font-medium text-gray-700
                   bg-while border border-black rounded-md shadow-sm hover:bg-gray-50
                   focus:outline-none focus:ring-2 focus:ring-offset-2" // Изменил цвет фокуса на indigo
      >
        {/* Убрал font-bold отсюда, если он был на родительском div, он применится */}
        <span>Сортировать: {sortLabels[sortType]}</span> 
        <svg
          className={`w-5 h-5 ml-2 -mr-1 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Выпадающий список */}
      <div
        className={`${baseDropdownClasses} ${transitionClasses} ${stateClasses}`}
        // origin-top-right или origin-top в зависимости от выравнивания
        style={{ transformOrigin: 'top' }} 
      >
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {(Object.keys(EnumProductSort) as Array<keyof typeof EnumProductSort>).map((key) => {
            const value = EnumProductSort[key]
            const isSelected = sortType === value

            return (
              <button
                key={key}
                onClick={() => {
                  setSortType(value)
                  setIsOpen(false)
                }}
                className={`block w-full text-left px-4 py-2.5 text-m 
                            ${isSelected ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700'}
                            hover:bg-indigo-100  focus:outline-none focus:bg-indigo-100 focus:text-indigo-700`}
                role="menuitem"
              >
                {sortLabels[value]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SortDropdown