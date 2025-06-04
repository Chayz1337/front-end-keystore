// Файл: AddGameModal.tsx
// (импорты и интерфейсы остаются как есть, если они корректны)
import { FC, useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import Modal from '@/src/components/ui/modal/Modal';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import { ICategory } from '@/src/types/category.interface';
import { IProduct } from '@/src/types/product.interface';
import styles from './AddGameModal.module.scss';
import { Trash2 } from 'lucide-react';
import Select, { MultiValue, StylesConfig, ActionMeta } from 'react-select';

interface IAddGameModal {
  isOpen: boolean;
  closeModal: () => void;
  initialData?: IProduct | null;
  onFormSubmit?: (updatedOrCreatedGame?: IProduct) => void; // <--- Изменено: теперь может принимать данные игры
}

interface CategoryOption {
  value: number;
  label: string;
}

const customSelectStyles: StylesConfig<CategoryOption, true> = {
  // ... ваши стили ...
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  control: provided => ({
    ...provided,
    borderColor: '#e2e8f0',
    borderRadius: '0.375rem',
    minHeight: 'calc(1.25rem + 8px * 2 + 2px)',
    boxShadow: 'none',
    '&:hover': { borderColor: '#cbd5e1' },
  }),
};

interface GameFormState {
  game_id?: number;
  name: string;
  description: string;
  price: number;
  images: string[]; // URLы: blob: для новых превью, http(s): для существующих
  categories: number[];
}

const AddGameModal: FC<IAddGameModal> = ({
  isOpen,
  closeModal: originalCloseModalProp,
  initialData,
  onFormSubmit, // Используем его
}) => {
  const getInitialFormState = (data?: IProduct | null): GameFormState => {
    if (data) {
      return {
        game_id: data.game_id,
        name: data.name || '',
        description: data.description || '',
        price: data.price ?? 0,
        images: data.images || [], // Это должны быть URL вида http://localhost:9000/...
        categories: data.game_categories?.map(gc => gc.category.category_id) || [],
      };
    }
    return { name: '', description: '', price: 0, images: [], categories: [] };
  };

  const [gameData, setGameData] = useState<GameFormState>(() => getInitialFormState(initialData));
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImagesToDelete, setExistingImagesToDelete] = useState<string[]>([]);

  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<MultiValue<CategoryOption>>([]);
  const [availableCategories, setAvailableCategories] = useState<ICategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const isEditMode = !!initialData?.game_id;

  const blobUrlToFileMapRef = useRef<Map<string, File>>(new Map());

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setError('');
      setIsSubmitting(false);
      const initState = getInitialFormState(initialData);
      console.log("Initial state for modal:", initState); // Отладка: какие images приходят
      setGameData(initState);
      setSelectedFiles([]);
      setExistingImagesToDelete([]);
      
      cleanupBlobUrls();

      setIsLoadingCategories(true);
      CategoryService.getAll()
        .then(res => {
          if (!isMounted) return;
          const allCats = res.data || [];
          setAvailableCategories(allCats);
          const currentCatOpts = allCats
            .filter(cat => initState.categories.includes(cat.category_id))
            .map(cat => ({ value: cat.category_id, label: cat.category_name }));
          setSelectedCategoryOptions(currentCatOpts);
        })
        .catch(err => {
          console.error('Failed to load categories:', err);
          if (isMounted) setError('Ошибка загрузки категорий.');
        })
        .finally(() => {
          if (isMounted) setIsLoadingCategories(false);
        });
    } else {
      cleanupBlobUrls();
    }
    return () => {
      isMounted = false;
      if (isOpen) {
        cleanupBlobUrls();
      }
    };
  }, [isOpen, initialData]);

  const cleanupBlobUrls = () => {
    blobUrlToFileMapRef.current.forEach((_file, url) => URL.revokeObjectURL(url));
    blobUrlToFileMapRef.current.clear();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFilesArray = Array.from(files);
    const newPreviewUrls: string[] = [];
    const newBlobUrlMapUpdates = new Map<string, File>();
    let filesToActuallyAdd: File[] = []; // Только валидные файлы

    newFilesArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError(prev => prev ? `${prev}\nФайл "${file.name}" не является изображением.` : `Файл "${file.name}" не является изображением.`);
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      newPreviewUrls.push(blobUrl);
      newBlobUrlMapUpdates.set(blobUrl, file);
      filesToActuallyAdd.push(file); // Добавляем в список на отправку
    });
    
    setSelectedFiles(prev => [...prev, ...filesToActuallyAdd]);
    setGameData(prev => ({ ...prev, images: [...prev.images, ...newPreviewUrls] }));
    
    newBlobUrlMapUpdates.forEach((file, url) => blobUrlToFileMapRef.current.set(url, file));

    if (e.target) e.target.value = '';
    // Сброс общей ошибки если успешно добавлены файлы и была только ошибка про тип файла
    if (error.includes("не является изображением") && newPreviewUrls.length > 0) {
        const otherErrors = error.split('\n').filter(line => !line.includes("не является изображением")).join('\n');
        setError(otherErrors);
    } else if (newPreviewUrls.length > 0) {
        setError('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const urlToRemove = gameData.images[indexToRemove];
    
    // Обновляем отображаемые изображения
    setGameData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));

    if (urlToRemove.startsWith('blob:')) {
      const fileToRemove = blobUrlToFileMapRef.current.get(urlToRemove);
      if (fileToRemove) {
        // Удаляем из списка файлов, которые будут отправлены на сервер
        setSelectedFiles(prevFiles => prevFiles.filter(f => f !== fileToRemove));
      }
      URL.revokeObjectURL(urlToRemove);
      blobUrlToFileMapRef.current.delete(urlToRemove);
    } else if (isEditMode && initialData?.images?.includes(urlToRemove)) { // Убедимся, что это действительно существующее изображение
      // Если это существующее изображение (не blob), добавляем в список на удаление с сервера
      if (!existingImagesToDelete.includes(urlToRemove)) {
        setExistingImagesToDelete(prev => [...prev, urlToRemove]);
      }
    }
  };

  const handleCategorySelectChange = (
    options: MultiValue<CategoryOption>,
    _actionMeta: ActionMeta<CategoryOption>
  ) => {
    setSelectedCategoryOptions(options);
    setGameData(prev => ({ ...prev, categories: options.map(o => o.value) }));
    if (error) setError('');
  };

  const handleCloseModalWrapper = () => {
    originalCloseModalProp();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Валидация
    const missing: string[] = [];
    if (!gameData.name.trim()) missing.push('название');
    
    // Подсчет итогового количества изображений
    const currentDisplayedHttpImages = gameData.images.filter(img => img.startsWith('http')).length;
    const newImagesToBeUploadedCount = selectedFiles.length;
    const finalImageCount = currentDisplayedHttpImages + newImagesToBeUploadedCount;

    if (finalImageCount === 0) {
         missing.push('хотя бы одно изображение');
    }

    if (gameData.categories.length === 0) missing.push('хотя бы одну категорию');
    if (gameData.price < 0 || gameData.price === null || gameData.price === undefined) missing.push('корректную цену (не отрицательную)');


    if (missing.length > 0) {
      setError(`Пожалуйста, заполните: ${missing.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('name', gameData.name.trim());
    formDataPayload.append('price', gameData.price.toString());
    if (gameData.description.trim()) {
      formDataPayload.append('description', gameData.description.trim());
    }
    // Убедимся, что categories не пустой массив перед отправкой
    if (gameData.categories.length > 0) {
        gameData.categories.forEach(catId => {
          formDataPayload.append('categories[]', catId.toString());
        });
    } else if (!isEditMode) { // Если создание и нет категорий - это ошибка валидации выше
        // для редактирования, если категории не переданы, они не меняются (бэк должен это обработать)
    }


    try {
      let savedGame: IProduct | undefined; // Для передачи в onFormSubmit

      if (isEditMode && gameData.game_id) {
        // Добавляем новые файлы (которые есть в selectedFiles и являются blob)
        selectedFiles.forEach(file => formDataPayload.append('newImages', file, file.name));
        // Добавляем URL существующих изображений, которые нужно удалить
        existingImagesToDelete.forEach(url => formDataPayload.append('deletedImageUrls', url));
        
        console.log("ОТПРАВКА НА UPDATE (ID: " + gameData.game_id + "): ", Object.fromEntries(formDataPayload.entries()));
        savedGame = await ProductService.update(gameData.game_id, formDataPayload);
        alert('Игра успешно обновлена!');
      } else {
        // Добавляем файлы для новой игры
        selectedFiles.forEach(file => {
          formDataPayload.append('images', file, file.name); // Бэкенд ожидает 'images' для создания
        });
        console.log("ОТПРАВКА НА CREATE: ", Object.fromEntries(formDataPayload.entries()));
        savedGame = await ProductService.create(formDataPayload);
        alert('✅ Игра успешно добавлена!');
      }

      console.log('ОТВЕТ ОТ ProductService.create/update:', savedGame); // <--- ВАЖНО: Проверяем, что здесь есть game.images с URL-ами

      cleanupBlobUrls();
      setSelectedFiles([]);
      setExistingImagesToDelete([]);
      originalCloseModalProp();
      if (onFormSubmit) {
        onFormSubmit(savedGame); // Передаем полученную игру в коллбэк
      }

    } catch (err: any) {
      console.error('Submit error:', err);
      // Улучшенная обработка сообщения об ошибке
      let errMsg = 'Произошла ошибка при сохранении.';
      if (err.response?.data?.message) {
        const serverMessage = err.response.data.message;
        errMsg = Array.isArray(serverMessage) ? serverMessage.join('; ') : String(serverMessage);
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Рендер компонента (JSX) остается в основном тем же.
  // Важно убедиться, что в `<img>` для превью используется `url` из `gameData.images`.
  return (
    <Modal isOpen={isOpen} closeModal={handleCloseModalWrapper}>
      <div className={`${styles.modalWindow} p-4 md:p-6`}>
        <h2 className="text-xl font-semibold text-center mb-4">
          {isEditMode ? 'Редактировать игру' : 'Добавить игру'}
        </h2>
        {error && (
            <p className={`${styles.errorText} mb-3 text-center whitespace-pre-line`}>{error}</p>
        )}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Название */}
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold text-sm text-gray-700">
              Название
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={gameData.name}
              onChange={handleChange}
              className={styles.formInput}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Описание */}
          <div>
            <label htmlFor="description" className="block mb-1 font-semibold text-sm text-gray-700">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={gameData.description}
              onChange={handleChange}
              className={`${styles.formInput} ${styles.textArea}`}
              disabled={isSubmitting}
            />
          </div>

          {/* Цена */}
          <div>
            <label htmlFor="price" className="block mb-1 font-semibold text-sm text-gray-700">
              Цена
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={gameData.price} // gameData.price может быть 0, что нормально
              onChange={handleChange}
              className={styles.formInput}
              min="0"
              step="any" // Для копеек
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Загрузка изображений */}
          <div>
            <label htmlFor="gameImageUpload" className="block mb-1 font-semibold text-sm text-gray-700">
              Изображения игры (можно несколько)
            </label>
            <input
              id="gameImageUpload"
              type="file"
              accept="image/*" // Только изображения
              multiple
              onChange={handleFileSelect}
              className={`${styles.formInput} cursor-pointer`}
              disabled={isSubmitting}
            />
            {gameData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {gameData.images.map((url, idx) => (
                  <div key={url + idx} className="relative group aspect-square">
                    <img 
                        src={url} // Это будет либо blob: либо http://localhost:9000/...
                        alt={`Превью ${idx + 1}`} 
                        className="w-full h-full object-cover rounded shadow-sm"
                        onError={(e) => { // Обработка ошибки загрузки, если URL битый
                            console.warn(`Не удалось загрузить изображение: ${url}`);
                            // Можно заменить на placeholder, если URL не blob и не загрузился
                            if (!url.startsWith('blob:')) {
                                (e.target as HTMLImageElement).src = '/placeholder-image.png'; // Убедитесь, что placeholder есть
                            }
                        }}
                    />
                    {/* Показываем кнопку удаления, если это не существующее изображение, уже помеченное к удалению */}
                    {!(isEditMode && existingImagesToDelete.includes(url) && url.startsWith('http')) && (
                        <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Удалить"
                        disabled={isSubmitting}
                        >
                        <Trash2 size={14} />
                        </button>
                    )}
                    {/* Индикатор, что существующее изображение (http) будет удалено */}
                    {isEditMode && existingImagesToDelete.includes(url) && url.startsWith('http') && (
                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                          <span className="text-white text-xs text-center">К удалению</span>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Категории */}
          <div>
            <label htmlFor="categoriesSelect" className="block mb-1 font-semibold text-sm text-gray-700">
              Категории
            </label>
            <Select<CategoryOption, true>
              id="categoriesSelect"
              instanceId="add-game-modal-categories-select"
              options={availableCategories.map(cat => ({
                value: cat.category_id,
                label: cat.category_name,
              }))}
              value={selectedCategoryOptions}
              onChange={handleCategorySelectChange}
              isMulti
              isLoading={isLoadingCategories}
              isDisabled={isLoadingCategories || isSubmitting}
              placeholder={isLoadingCategories ? "Загрузка..." : "Выберите категории..."}
              noOptionsMessage={() => isLoadingCategories ? "Загрузка..." : "Нет опций"}
              styles={customSelectStyles}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              menuPosition="fixed"
            />
          </div>

          {/* Кнопка */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoadingCategories || isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : isEditMode ? 'Сохранить изменения' : 'Добавить игру'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddGameModal;