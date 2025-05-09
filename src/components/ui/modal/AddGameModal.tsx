// src/components/ui/modal/AddGameModal.tsx
import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Modal from '@/src/components/ui/modal/Modal';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { FileService } from '@/src/assets/styles/services/file.service';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import { ICategory } from '@/src/types/category.interface';
import { IProduct } from '@/src/types/product.interface';
import { TypeProductData } from '@/src/assets/styles/services/product/product.types';
import styles from './AddGameModal.module.scss'; // Импортируем наши стили
import { Trash2 } from 'lucide-react';
import Select, { MultiValue, StylesConfig } from 'react-select';

interface IAddGameModal {
  isOpen: boolean;
  closeModal: () => void;
  initialData?: IProduct | null;
  onFormSubmit?: () => void;
}

interface CategoryOption {
  value: number;
  label: string;
}

const customSelectStyles: StylesConfig<CategoryOption, true> = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (provided) => ({ // Стили для основного контейнера Select
    ...provided,
    borderColor: '#e2e8f0', // Tailwind gray-300
    borderRadius: '0.375rem', // Tailwind rounded-md
    minHeight: 'calc(1.25rem + 8px * 2 + 2px)', // Примерно как у formInput (line-height + padding-y * 2 + border * 2)
    boxShadow: 'none', // Убираем дефолтную тень при фокусе, если есть
    '&:hover': {
      borderColor: '#cbd5e1', // Tailwind gray-400
    },
  }),
  // Дополнительные стили для react-select можно добавить здесь, если нужно
};

type GameFormData = Omit<TypeProductData, 'description' | 'images' | 'categories'> & {
    game_id?: number;
    description: string;
    images: string[];
    categories: number[];
};

const AddGameModal: FC<IAddGameModal> = ({ isOpen, closeModal, initialData, onFormSubmit }) => {
  // ... (весь остальной код компонента: getInitialFormData, useState, useEffect, handleChange, и т.д. ОСТАЕТСЯ ПРЕЖНИМ)
  // Я не буду его повторять здесь для краткости, он был в предыдущем ответе и не меняется из-за SCSS правок,
  // кроме JSX части рендера.

  // --- Начало не измененной логики (взято из предыдущего ответа) ---
  console.log('AddGameModal Render/Update. isOpen:', isOpen, 'initialData:', initialData ? `ID: ${initialData.game_id}` : initialData);

  const getInitialFormData = (data?: IProduct | null): GameFormData => {
    // ... (код без изменений)
    console.log('getInitialFormData: initialData:', data ? `ID: ${data.game_id}` : data);
    if (data) {
      return {
        game_id: data.game_id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        images: data.images || [],
        categories: data.game_categories?.map(gc => gc.category.category_id).filter((id): id is number => typeof id === 'number') || [],
      };
    }
    return { name: '', description: '', price: 0, images: [], categories: [] };
  };

  const [gameData, setGameData] = useState<GameFormData>(() => getInitialFormData(initialData));
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<MultiValue<CategoryOption>>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [availableCategories, setAvailableCategories] = useState<ICategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const isEditMode = !!initialData && !!initialData.game_id;

  useEffect(() => {
    // ... (код без изменений)
    console.log('AddGameModal useEffect [isOpen, initialData]. isOpen:', isOpen);
    let isMounted = true;

    if (isOpen) {
      setError('');
      setIsSubmitting(false);
      setIsUploadingImages(false);
      setUploadProgress({});
      setUploadErrors({});
      
      const currentInitialFormData = getInitialFormData(initialData);
      console.log('useEffect: Устанавливаем gameData из initialData:', currentInitialFormData);
      setGameData(currentInitialFormData);

      setIsLoadingCategories(true);
      CategoryService.getAll()
        .then(response => {
          if (!isMounted) return;
          const fetchedCategories = response.data || [];
          console.log('useEffect: Категории загружены:', fetchedCategories.length);
          setAvailableCategories(fetchedCategories);

          if (currentInitialFormData.categories.length > 0 && fetchedCategories.length > 0) {
            const preselectedOptions = fetchedCategories
              .filter(cat => currentInitialFormData.categories.includes(cat.category_id))
              .map(cat => ({ value: cat.category_id, label: cat.category_name }));
            console.log('useEffect: Устанавливаем selectedCategoryOptions:', preselectedOptions);
            setSelectedCategoryOptions(preselectedOptions);
          } else {
            console.log('useEffect: Сброс selectedCategoryOptions');
            setSelectedCategoryOptions([]);
          }
        })
        .catch(catError => {
          if (!isMounted) return;
          console.error("Failed to load categories:", catError.response?.data || catError.message || catError);
          const errorMsg = catError.response?.data?.message || catError.message || "Не удалось загрузить список категорий.";
          setError(`Ошибка загрузки категорий: ${errorMsg}`);
        })
        .finally(() => {
          if (isMounted) setIsLoadingCategories(false);
        });
    }
    return () => { isMounted = false; };
  }, [isOpen, initialData]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // ... (код без изменений)
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    // ... (код без изменений)
     const files = e.target.files;
    if (!files || files.length === 0) return;
    console.log(`handleImageUpload: выбрано ${files.length} файлов`);
    setError(''); setUploadErrors({}); setUploadProgress({}); setIsUploadingImages(true);
    const newImageUrls: string[] = []; const currentErrors: Record<string, string> = {};
    for (const file of Array.from(files)) {
        console.log(`Загрузка файла: ${file.name}`);
        try {
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
            const url = await FileService.uploadGameImage(file);
            console.log(`Файл ${file.name} загружен, URL: ${url}`);
            newImageUrls.push(url);
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        } catch (err: any) {
            console.error(`Ошибка загрузки файла ${file.name}:`, err.message);
            currentErrors[file.name] = err.message || 'Не удалось загрузить файл.';
            setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
        }
    }
    setGameData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
    setUploadErrors(currentErrors); setIsUploadingImages(false); e.target.value = '';
    console.log('handleImageUpload: загрузка завершена');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    // ... (код без изменений)
     console.log(`handleRemoveImage: удаление индекса ${indexToRemove}`);
     setGameData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleCategorySelectChange = (selectedOptions: MultiValue<CategoryOption>) => {
    // ... (код без изменений)
    console.log('handleCategorySelectChange:', selectedOptions);
    setSelectedCategoryOptions(selectedOptions);
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setGameData(prev => ({ ...prev, categories: selectedIds }));
     if (error.includes("категор")) { setError(''); }
  };

  const categorySelectOptions: CategoryOption[] = availableCategories.map(cat => ({
    // ... (код без изменений)
    value: cat.category_id,
    label: cat.category_name,
  }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleSubmit: Начало. isEditMode:', isEditMode, 'gameData:', JSON.stringify(gameData));
    setIsSubmitting(true); setError('');
    const { game_id, ...payloadData } = gameData;
    const finalPayload: TypeProductData = {
        name: payloadData.name.trim(),
        price: payloadData.price,
        description: payloadData.description.trim() || undefined,
        images: payloadData.images,
        categories: payloadData.categories,
    };
    const missing: string[] = [];
    if (!finalPayload.name) missing.push('название');
    if (finalPayload.images.length === 0) missing.push('хотя бы одно изображение');
    if (finalPayload.categories.length === 0) missing.push('категории');
    if (missing.length) {
      setError(`Пожалуйста, заполните: ${missing.join(', ')}`);
      setIsSubmitting(false);
      console.warn('handleSubmit: Ошибка валидации', missing);
      return;
    }
    try {
      if (isEditMode && game_id) {
        console.log(`handleSubmit: Вызов ProductService.update для ID: ${game_id} с payload:`, finalPayload);
        await ProductService.update(game_id, finalPayload);
        alert('Игра успешно обновлена!'); // Для редактирования оставим без эмодзи, или можно тоже добавить ✅
      } else {
        console.log(`handleSubmit: Вызов ProductService.create с payload:`, finalPayload);
        await ProductService.create(finalPayload);
        alert('✅ Игра успешно добавлена!'); // <--- ИЗМЕНЕНИЕ ЗДЕСЬ
      }
      if (onFormSubmit) { onFormSubmit(); }
      closeModal();
    } catch (err: any) {
      console.error('❌ Error submitting form:', err.response?.data || err.message);
      let errorMsg = isEditMode ? "Ошибка при обновлении игры." : "Ошибка при добавлении игры.";
      if (err.response?.data?.message) { errorMsg = String(err.response.data.message); }
      else if (err.message) { errorMsg = err.message; }
      setError(`${errorMsg} Посмотрите консоль.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- Конец не измененной логики ---


  // --- JSX с изменениями для отступов ---
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      {/* Обертка с кастомными стилями для модального окна */}
      <div className={`${styles.modalWindow} p-4 md:p-6`}> {/* Добавлены Tailwind паддинги */}
        <h2 className="text-xl font-semibold text-center mb-4">
          {isEditMode ? 'Редактировать игру' : 'Добавить игру'}
        </h2>
        {error && <p className={`${styles.errorText} mb-3 text-center`}>{error}</p>}
        
        {/* Форма с Tailwind для отступов между группами полей */}
        <form onSubmit={handleSubmit} className="w-full space-y-4"> {/* w-full и space-y-4 */}
          {/* Название */}
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold text-sm text-gray-700">Название</label>
            <input
              id="name"
              type="text" name="name" value={gameData.name} onChange={handleChange}
              placeholder="Название игры" className={styles.formInput} required
              disabled={isSubmitting}
            />
          </div>

          {/* Описание */}
          <div>
            <label htmlFor="description" className="block mb-1 font-semibold text-sm text-gray-700">Описание</label>
            <textarea
              id="description"
              name="description" value={gameData.description} onChange={handleChange}
              placeholder="Описание игры" className={`${styles.formInput} ${styles.textArea}`}
              disabled={isSubmitting}
            />
          </div>

          {/* Цена */}
          <div>
            <label htmlFor="price" className="block mb-1 font-semibold text-sm text-gray-700">Цена</label>
            <input
              id="price"
              type="number"
              name="price"
              value={gameData.price}
              onChange={handleChange}
              placeholder="Цена"
              className={styles.formInput}
              min={0}
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Загрузка Изображений */}
          <div>
            <label htmlFor="gameImageUpload" className="block mb-1 font-semibold text-sm text-gray-700">Изображения игры (можно несколько)</label>
            <input
              id="gameImageUpload" type="file" accept="image/*" multiple
              onChange={handleImageUpload} className={`${styles.formInput} cursor-pointer`} // Добавил cursor-pointer для инпута файла
              disabled={isUploadingImages || isSubmitting}
            />
            {isUploadingImages && <p className="text-xs text-gray-500 mt-1">Загрузка...</p>}
            {Object.keys(uploadProgress).length > 0 && !isUploadingImages && (
              <div className="mt-2 space-y-1 text-xs">
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName}>
                    <span className="truncate max-w-[150px] inline-block">{fileName}: </span> {/* Ограничение длины имени файла */}
                    {progress === 100 && <span className="text-green-600">Загружено</span>}
                    {progress === -1 && <span className="text-red-600">Ошибка: {uploadErrors[fileName] || 'Неизвестная ошибка'}</span>}
                    {(progress !== undefined && progress >= 0 && progress < 100) && <span>Загрузка {progress}%</span>}
                  </div>
                ))}
              </div>
            )}
            {gameData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {gameData.images.map((imageUrl, index) => (
                  <div key={imageUrl + index} className="relative group aspect-square"> {/* aspect-square для квадратных превью */}
                    <img src={imageUrl} alt={`Превью ${index + 1}`} className="w-full h-full object-cover rounded shadow-sm"/>
                    <button type="button" onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red text-while rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150"
                      aria-label="Удалить изображение" title="Удалить изображение" disabled={isUploadingImages || isSubmitting}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Поле Категории с react-select */}
          <div>
            <label htmlFor="categoriesSelect" className="block mb-1 font-semibold text-sm text-gray-700">Категории</label>
            <Select<CategoryOption, true>
              id="categoriesSelect" instanceId="categories-select-unique-id"
              options={categorySelectOptions} value={selectedCategoryOptions}
              onChange={handleCategorySelectChange} isMulti isLoading={isLoadingCategories}
              isDisabled={isLoadingCategories || isSubmitting || (availableCategories.length === 0 && isOpen && !error.includes("Ошибка загрузки категорий"))}
              placeholder={isLoadingCategories ? "Загрузка категорий..." : "Выберите категории..."}
              noOptionsMessage={() => isLoadingCategories ? "Загрузка..." : "Категории не найдены"}
              className="react-select-container" // Можно добавить общий класс для стилизации контейнера
              classNamePrefix="react-select"    // Для стилизации внутренних элементов
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={customSelectStyles} menuPosition="fixed"
            />
             {isLoadingCategories && <p className="text-xs text-gray-500 mt-1">Загрузка категорий...</p>}
             {!isLoadingCategories && availableCategories.length === 0 && isOpen && !error.includes("Ошибка загрузки категорий") && (
                  <p className="text-xs text-orange-600 mt-1">Категории не загружены или отсутствуют. Добавьте их сначала.</p>
             )}
          </div>

          {/* Кнопка */}
          <div className="flex justify-end pt-3"> {/* Увеличил отступ кнопки */}
            <button type="submit" className={styles.submitButton}
                    disabled={isUploadingImages || isLoadingCategories || isSubmitting}>
              {isSubmitting ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Добавить игру')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddGameModal;