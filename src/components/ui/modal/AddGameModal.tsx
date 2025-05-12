import { FC, useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import Modal from '@/src/components/ui/modal/Modal';
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import { FileService } from '@/src/assets/styles/services/file.service';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import { ICategory } from '@/src/types/category.interface';
import { IProduct } from '@/src/types/product.interface';
import { TypeProductData } from '@/src/assets/styles/services/product/product.types';
import styles from './AddGameModal.module.scss';
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

type GameFormData = Omit<TypeProductData, 'description' | 'images' | 'categories'> & {
  game_id?: number;
  description: string;
  images: string[];
  categories: number[];
};

const AddGameModal: FC<IAddGameModal> = ({
  isOpen,
  closeModal: originalCloseModalProp,
  initialData,
  onFormSubmit
}) => {
  // ——————————————————————————————————————————————————————————
  // Состояния и рефы
  // ——————————————————————————————————————————————————————————
  const [gameData, setGameData] = useState<GameFormData>(() => getInitialFormData(initialData));
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<MultiValue<CategoryOption>>([]);
  const [availableCategories, setAvailableCategories] = useState<ICategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<string[]>([]);
  const initialImagesRef = useRef<string[]>([]);
  const isEditMode = !!initialData?.game_id;

  // ——————————————————————————————————————————————————————————
  // Инициализация и сброс при открытии/закрытии
  // ——————————————————————————————————————————————————————————
  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      setError(''); setIsSubmitting(false); setIsUploadingImages(false);
      setUploadProgress({}); setUploadErrors({}); setNewlyUploadedImages([]);
      const initData = getInitialFormData(initialData);
      setGameData(initData);
      initialImagesRef.current = initialData?.images || [];

      setIsLoadingCategories(true);
      CategoryService.getAll()
        .then(res => {
          if (!isMounted) return;
          setAvailableCategories(res.data || []);
          // предзаполнить селект
          const opts = (res.data || [])
            .filter(cat => initData.categories.includes(cat.category_id))
            .map(cat => ({ value: cat.category_id, label: cat.category_name }));
          setSelectedCategoryOptions(opts);
        })
        .catch(err => {
          console.error('Failed to load categories:', err);
          setError('Ошибка загрузки категорий.');
        })
        .finally(() => isMounted && setIsLoadingCategories(false));
    } else {
      // при закрытии — очистка "осиротевших" изображений
      if (newlyUploadedImages.length > 0) {
        const imagesToClean = [...newlyUploadedImages];
        setNewlyUploadedImages([]);
        cleanupNewlyUploadedImages(imagesToClean);
      }
    }

    return () => { isMounted = false; };
  }, [isOpen, initialData]);

  // ——————————————————————————————————————————————————————————
  // Хэндлеры
  // ——————————————————————————————————————————————————————————
  function getInitialFormData(data?: IProduct | null): GameFormData {
    if (data) {
      return {
        game_id: data.game_id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        images: data.images || [],
        categories: data.game_categories?.map(gc => gc.category.category_id) || [],
      };
    }
    return { name: '', description: '', price: 0, images: [], categories: [] };
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setError(''); setIsUploadingImages(true); setUploadProgress({}); setUploadErrors({});
    const uploaded: string[] = [];
    const errs: Record<string, string> = {};

    for (const file of Array.from(files)) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        const url = await FileService.uploadGameImage(file, ev => {
          const pct = Math.round((ev.loaded * 100) / ev.total);
          setUploadProgress(prev => ({ ...prev, [file.name]: pct }));
        });
        uploaded.push(url);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (err: any) {
        errs[file.name] = err.message || 'Ошибка';
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
      }
    }

    setGameData(prev => ({ ...prev, images: [...prev.images, ...uploaded] }));
    setNewlyUploadedImages(prev => [...prev, ...uploaded]);
    setUploadErrors(errs);
    setIsUploadingImages(false);
    if (e.target) e.target.value = '';
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    const url = gameData.images[indexToRemove];
    setGameData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));

    if (newlyUploadedImages.includes(url)) {
      try {
        await FileService.deleteGameImageByUrl(url);
        setNewlyUploadedImages(prev => prev.filter(u => u !== url));
      } catch {
        setError(`Не удалось удалить изображение ${url.split('/').pop()}`);
      }
    }
  };

  const handleCategorySelectChange = (opts: MultiValue<CategoryOption>) => {
    setSelectedCategoryOptions(opts);
    setGameData(prev => ({ ...prev, categories: opts.map(o => o.value) }));
    if (error) setError('');
  };

  const cleanupNewlyUploadedImages = async (urls: string[]) => {
    await Promise.allSettled(urls.map(u => FileService.deleteGameImageByUrl(u)));
  };

  const handleCloseModalWrapper = async () => {
    await cleanupNewlyUploadedImages(newlyUploadedImages);
    originalCloseModalProp();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setError('');

    const missing: string[] = [];
    if (!gameData.name.trim()) missing.push('название');
    if (gameData.images.length === 0) missing.push('хотя бы одно изображение');
    if (gameData.categories.length === 0) missing.push('категории');
    if (gameData.price < 0) missing.push('корректную цену');

    if (missing.length) {
      setError(`Пожалуйста, заполните: ${missing.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    const payload: TypeProductData = {
      name: gameData.name.trim(),
      price: gameData.price,
      description: gameData.description.trim() || undefined,
      images: gameData.images,
      categories: gameData.categories,
    };

    try {
      if (isEditMode && gameData.game_id) {
        await ProductService.update(gameData.game_id, payload);
        alert('Игра успешно обновлена!');
      } else {
        await ProductService.create(payload);
        alert('✅ Игра успешно добавлена!');
      }
      setNewlyUploadedImages([]);
      originalCloseModalProp();
      onFormSubmit?.();
    } catch (err: any) {
      console.error('Submit error:', err);
      setError('Ошибка при сохранении. Смотрите консоль.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ——————————————————————————————————————————————————————————
  // JSX
  // ——————————————————————————————————————————————————————————
  return (
    <Modal isOpen={isOpen} closeModal={handleCloseModalWrapper}>
      <div className={`${styles.modalWindow} p-4 md:p-6`}>
        <h2 className="text-xl font-semibold text-center mb-4">
          {isEditMode ? 'Редактировать игру' : 'Добавить игру'}
        </h2>
        {error && <p className={`${styles.errorText} mb-3 text-center`}>{error}</p>}
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
              disabled={isSubmitting || isUploadingImages}
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
              disabled={isSubmitting || isUploadingImages}
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
              value={gameData.price}
              onChange={handleChange}
              className={styles.formInput}
              min="0"
              step="0.01"
              disabled={isSubmitting || isUploadingImages}
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
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={`${styles.formInput} cursor-pointer`}
              disabled={isUploadingImages || isSubmitting}
            />
            {isUploadingImages && <p className="text-xs text-gray-500 mt-1">Загрузка...</p>}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="mt-2 space-y-1 text-xs">
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName}>
                    <span className="truncate max-w-[150px] inline-block">{fileName}: </span>
                    {progress === 100 && <span className="text-green-600">Загружено</span>}
                    {progress === -1 && <span className="text-red-600">Ошибка: {uploadErrors[fileName]}</span>}
                    {progress >= 0 && progress < 100 && <span>Загрузка {progress}%</span>}
                  </div>
                ))}
              </div>
            )}
            {gameData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {gameData.images.map((url, idx) => (
                  <div key={url + idx} className="relative group aspect-square">
                    <img src={url} alt={`Превью ${idx + 1}`} className="w-full h-full object-cover rounded shadow-sm" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-while rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      aria-label="Удалить"
                      disabled={isUploadingImages || isSubmitting}
                    >
                      <Trash2 size={14} />
                    </button>
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
              instanceId="categories-select"
              options={availableCategories.map(cat => ({
                value: cat.category_id,
                label: cat.category_name
              }))}
              value={selectedCategoryOptions}
              onChange={handleCategorySelectChange}
              isMulti
              isLoading={isLoadingCategories}
              isDisabled={isLoadingCategories || isSubmitting || isUploadingImages}
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
              disabled={isUploadingImages || isLoadingCategories || isSubmitting}
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
