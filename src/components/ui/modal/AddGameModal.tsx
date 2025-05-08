// src/components/ui/modal/AddGameModal.tsx
import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Modal from '@/src/components/ui/modal/Modal';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { FileService } from '@/src/assets/styles/services/file.service';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import { ICategory } from '@/src/types/category.interface';
import { IProduct } from '@/src/types/product.interface';
import { TypeProductData } from '@/src/assets/styles/services/product/product.types'; // Используем обновленный тип
import styles from './AddGameModal.module.scss';
import { Trash2 } from 'lucide-react';
import Select, { MultiValue, StylesConfig } from 'react-select';

interface IAddGameModal {
  isOpen: boolean;
  closeModal: () => void;
  initialData?: IProduct | null; // Данные для предзаполнения в режиме редактирования
  onFormSubmit?: () => void;   // Коллбэк после успешного сабмита
}

interface CategoryOption {
  value: number;
  label: string;
}

const customSelectStyles: StylesConfig<CategoryOption, true> = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

// Тип для внутреннего состояния формы
type GameFormData = Omit<TypeProductData, 'description' | 'images' | 'categories'> & {
    game_id?: number; // ID для режима редактирования
    description: string;
    images: string[];
    categories: number[];
};

const AddGameModal: FC<IAddGameModal> = ({ isOpen, closeModal, initialData, onFormSubmit }) => {
  console.log('AddGameModal Render/Update. isOpen:', isOpen, 'initialData:', initialData ? `ID: ${initialData.game_id}` : initialData);

  // Функция для получения начального состояния формы
  const getInitialFormData = (data?: IProduct | null): GameFormData => {
    console.log('getInitialFormData: initialData:', data ? `ID: ${data.game_id}` : data);
    if (data) {
      // Режим редактирования: заполняем из initialData
      return {
        game_id: data.game_id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        images: data.images || [],
        categories: data.game_categories?.map(gc => gc.category.category_id).filter((id): id is number => typeof id === 'number') || [],
      };
    }
    // Режим добавления: возвращаем пустые значения
    return { name: '', description: '', price: 0, images: [], categories: [] };
  };

  const [gameData, setGameData] = useState<GameFormData>(() => getInitialFormData(initialData)); // Инициализация при первом рендере
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<MultiValue<CategoryOption>>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [availableCategories, setAvailableCategories] = useState<ICategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Определяем режим редактирования
  const isEditMode = !!initialData && !!initialData.game_id;

  // Эффект для загрузки категорий и СИНХРОНИЗАЦИИ состояния с initialData
  useEffect(() => {
    console.log('AddGameModal useEffect [isOpen, initialData]. isOpen:', isOpen);
    let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования

    if (isOpen) {
      // Сбрасываем предыдущие ошибки и статусы при каждом открытии
      setError('');
      setIsSubmitting(false);
      setIsUploadingImages(false);
      setUploadProgress({});
      setUploadErrors({});
      
      // Устанавливаем форму на основе initialData, переданного при открытии
      const currentInitialFormData = getInitialFormData(initialData);
      console.log('useEffect: Устанавливаем gameData из initialData:', currentInitialFormData);
      setGameData(currentInitialFormData);

      // Загружаем категории, если их еще нет
      // (можно оптимизировать и не грузить каждый раз, если они не меняются)
      setIsLoadingCategories(true);
      CategoryService.getAll()
        .then(response => {
          if (!isMounted) return;
          const fetchedCategories = response.data || [];
          console.log('useEffect: Категории загружены:', fetchedCategories.length);
          setAvailableCategories(fetchedCategories);

          // Обновляем выбранные опции для react-select ПОСЛЕ загрузки категорий
          // и на основе УЖЕ установленного gameData
          if (currentInitialFormData.categories.length > 0 && fetchedCategories.length > 0) {
            const preselectedOptions = fetchedCategories
              .filter(cat => currentInitialFormData.categories.includes(cat.category_id))
              .map(cat => ({ value: cat.category_id, label: cat.category_name }));
            console.log('useEffect: Устанавливаем selectedCategoryOptions:', preselectedOptions);
            setSelectedCategoryOptions(preselectedOptions);
          } else {
            console.log('useEffect: Сброс selectedCategoryOptions (нет категорий в данных или не загружены)');
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

    return () => {
      isMounted = false; // Очистка при размонтировании
    };

  }, [isOpen, initialData]); // Зависимость только от isOpen и initialData


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
    if (!files || files.length === 0) return;
    console.log(`handleImageUpload: выбрано ${files.length} файлов`);
    setError(''); setUploadErrors({}); setUploadProgress({}); setIsUploadingImages(true);
    const newImageUrls: string[] = []; const currentErrors: Record<string, string> = {};
    // Загрузка файлов по одному
    for (const file of Array.from(files)) { // Итерация по FileList
        console.log(`Загрузка файла: ${file.name}`);
        try {
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
            const url = await FileService.uploadGameImage(file); // Сервис загрузки
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
     console.log(`handleRemoveImage: удаление индекса ${indexToRemove}`);
     setGameData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleCategorySelectChange = (selectedOptions: MultiValue<CategoryOption>) => {
    console.log('handleCategorySelectChange:', selectedOptions);
    setSelectedCategoryOptions(selectedOptions);
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setGameData(prev => ({ ...prev, categories: selectedIds }));
     if (error.includes("категор")) { setError(''); }
  };

  const categorySelectOptions: CategoryOption[] = availableCategories.map(cat => ({
    value: cat.category_id,
    label: cat.category_name,
  }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleSubmit: Начало. isEditMode:', isEditMode, 'gameData:', JSON.stringify(gameData));
    setIsSubmitting(true); setError('');

    const { game_id, ...payloadData } = gameData; // Отделяем game_id

    // Формируем финальный payload, соответствующий TypeProductData
    const finalPayload: TypeProductData = {
        name: payloadData.name.trim(),
        price: payloadData.price,
        description: payloadData.description.trim() || undefined, // Отправляем undefined, если пусто
        images: payloadData.images,
        categories: payloadData.categories, // Массив чисел
    };

    // Валидация
    const missing: string[] = [];
    if (!finalPayload.name) missing.push('название');
    // Описание теперь опционально в TypeProductData, валидация не обязательна
    if (finalPayload.images.length === 0) missing.push('хотя бы одно изображение');
    if (finalPayload.categories.length === 0) missing.push('категории'); // Считаем обязательными

    if (missing.length) {
      setError(`Пожалуйста, заполните: ${missing.join(', ')}`);
      setIsSubmitting(false);
      console.warn('handleSubmit: Ошибка валидации', missing);
      return;
    }

    try {
      if (isEditMode && game_id) {
        // Режим Редактирования
        console.log(`handleSubmit: Вызов ProductService.update для ID: ${game_id} с payload:`, finalPayload);
        await ProductService.update(game_id, finalPayload);
        alert('Игра успешно обновлена!');
      } else {
        // Режим Добавления
        console.log(`handleSubmit: Вызов ProductService.create с payload:`, finalPayload);
        await ProductService.create(finalPayload);
        alert('Игра успешно добавлена!');
      }
      if (onFormSubmit) { onFormSubmit(); } // Вызываем коллбэк для обновления списка
      closeModal(); // Закрываем модалку
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

  // --- JSX ---
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className={styles.modalWindow}>
        <h2 className="text-xl font-semibold text-center">
          {isEditMode ? 'Редактировать игру' : 'Добавить игру'}
        </h2>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          {/* Имя */}
          <input
            type="text" name="name" value={gameData.name} onChange={handleChange}
            placeholder="Название игры" className={styles.formInput} required
            disabled={isSubmitting}
          />
          {/* Описание */}
          <textarea
            name="description" value={gameData.description} onChange={handleChange}
            placeholder="Описание игры" className={`${styles.formInput} ${styles.textArea}`}
            disabled={isSubmitting}
          />
          {/* Цена */}
          <input
            type="number" name="price" value={gameData.price}
            onChange={handleChange} placeholder="Цена" className={styles.formInput} min={0} required
            disabled={isSubmitting}
          />

          {/* Загрузка Изображений */}
          <div>
            <label htmlFor="gameImageUpload" className="block mb-1">Изображения игры (можно несколько)</label>
            <input
              id="gameImageUpload" type="file" accept="image/*" multiple
              onChange={handleImageUpload} className={styles.formInput} disabled={isUploadingImages || isSubmitting}
            />
            {isUploadingImages && <p className="text-sm text-gray-500 mt-1">Загрузка...</p>}
            {Object.keys(uploadProgress).length > 0 && !isUploadingImages && (
              <div className="mt-2 space-y-1 text-xs">
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName}>
                    <span>{fileName}: </span>
                    {progress === 100 && <span className="text-green-600">Загружено</span>}
                    {progress === -1 && <span className="text-red-600">Ошибка: {uploadErrors[fileName] || 'Неизвестная ошибка'}</span>}
                    {(progress !== undefined && progress >= 0 && progress < 100) && <span>Загрузка {progress}%</span>}
                  </div>
                ))}
              </div>
            )}
            {gameData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {gameData.images.map((imageUrl, index) => (
                  <div key={imageUrl + index} className="relative group">
                    <img src={imageUrl} alt={`Превью ${index + 1}`} className="w-full h-24 object-cover rounded"/>
                    <button type="button" onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 m-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Удалить изображение" title="Удалить изображение" disabled={isUploadingImages || isSubmitting}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Поле Категории с react-select */}
          <div>
            <label htmlFor="categoriesSelect" className="block mb-1">Категории</label>
            <Select<CategoryOption, true>
              id="categoriesSelect" instanceId="categories-select-unique-id"
              options={categorySelectOptions} value={selectedCategoryOptions}
              onChange={handleCategorySelectChange} isMulti isLoading={isLoadingCategories}
              isDisabled={isLoadingCategories || isSubmitting || (availableCategories.length === 0 && isOpen && !error.includes("Ошибка загрузки категорий"))}
              placeholder="Выберите категории..."
              noOptionsMessage={() => isLoadingCategories ? "Загрузка..." : "Категории не найдены"}
              classNamePrefix="react-select"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={customSelectStyles} menuPosition="fixed"
            />
             {isLoadingCategories && <p className="text-xs text-gray-500 mt-1">Загрузка...</p>}
             {!isLoadingCategories && availableCategories.length === 0 && isOpen && !error.includes("Ошибка загрузки категорий") && (
                  <p className="text-xs text-orange-500 mt-1">Категории не загружены или отсутствуют.</p>
             )}
          </div>

          {/* Кнопка */}
          <div className="flex justify-end">
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