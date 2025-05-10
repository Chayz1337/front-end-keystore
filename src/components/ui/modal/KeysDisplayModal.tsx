// src/components/ui/modal/KeysDisplayModal.tsx
import { FC, useState } from 'react';
import Modal from '@/src/components/ui/modal/Modal';
import { IOrder, IOrderGameKeyItem } from '@/src/types/order.interface';
import { FiCopy, FiCheckCircle } from 'react-icons/fi'; // Иконки для копирования

interface KeysDisplayModalProps {
  order: IOrder | null; // Разрешаем null, чтобы не было ошибки при первой инициализации
  onClose: () => void;
}

const KeysDisplayModal: FC<KeysDisplayModalProps> = ({ order, onClose }) => {
  const [copiedKeyText, setCopiedKeyText] = useState<string | null>(null);

  // Если order еще не загружен (например, selectedOrderForKeys в MyOrders.tsx еще null),
  // можно ничего не рендерить или показать заглушку, хотя логика в MyOrders.tsx должна это предотвращать.
  if (!order) {
    console.warn('[KeysDisplayModal] Rendered with null order prop.');
    return null; 
  }

  const localHandleCopy = async (keyToCopy: string) => {
    try {
      await navigator.clipboard.writeText(keyToCopy);
      setCopiedKeyText(keyToCopy);
      // Здесь можно интегрировать toast-уведомление
      setTimeout(() => setCopiedKeyText(null), 2000);
    } catch (error) {
      console.error('Ошибка копирования в модалке:', error);
      alert('Не удалось скопировать ключ.');
    }
  };
  
  console.log('[KeysDisplayModal] Rendering with order ID:', order.order_id);

  return (
    <Modal isOpen={true} closeModal={onClose}>
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 truncate pr-2">
            Ключи для заказа #{order.order_id}
          </h3>
        </div>

        {order.order_keys && order.order_keys.length > 0 ? (
          <div className="space-y-4 max-h-[calc(60vh-120px)] overflow-y-auto pr-2 -mr-1 custom-scrollbar">
            {order.order_keys.map((keyObj: IOrderGameKeyItem, gameIdx: number) => (
              <div key={`game-${order.order_id}-${gameIdx}`} className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-700 mb-3 text-sm sm:text-base truncate">
                  {keyObj.game.name}
                </h4>
                <ul className="space-y-2">
                  {keyObj.activation_keys.map((activationKey: string, keyIdx: number) => (
                    <li 
                      key={`key-${order.order_id}-${gameIdx}-${keyIdx}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200/70 rounded-md transition-colors duration-150 group"
                    >
                      <span 
                        className="font-mono text-xs sm:text-sm text-slate-900 break-all mb-1.5 sm:mb-0 sm:mr-3 flex-grow selection:bg-blue-200"
                        title={activationKey}
                      >
                        {activationKey}
                      </span>
                      <button
                        type="button"
                        onClick={() => localHandleCopy(activationKey)}
                        className={`flex-shrink-0 inline-flex items-center justify-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-all duration-150 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-opacity-75
                          ${copiedKeyText === activationKey
                            ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'}`
                        }
                        aria-label={copiedKeyText === activationKey ? "Ключ скопирован" : `Скопировать ключ ${activationKey.substring(0, 5)}...`}
                      >
                        {copiedKeyText === activationKey ? (
                          <FiCheckCircle size={16} className="sm:mr-1.5" />
                        ) : (
                          <FiCopy size={15} className="sm:mr-1.5" />
                        )}
                        <span className="hidden sm:inline">
                            {copiedKeyText === activationKey ? 'Скопировано!' : 'Копировать'}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <p className="text-center">Ключи для этого заказа не найдены.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default KeysDisplayModal;