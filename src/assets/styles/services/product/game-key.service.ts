// src/services/game-key.service.ts
import { GameKey } from '@/src/types/game-key.interface';
import { axiosClassic, instanse } from '../../api/api.interceptor';

export const gameKeyService = {
    // ... getGameKeys остается без изменений ...
  
    async createGameKeys(gameId: number, activationKeys: string[]) {
      const response = await instanse<any>({ // Указываем ожидаемый тип ответа, если нужно
        method: 'POST',
        url: `/admin/game-keys`,
        data: {
          game_id: gameId,
          activation_keys: activationKeys
        }
      });
      return response.data;
    },

  async updateGameKeyUsage(keyId: number, isUsed: boolean): Promise<GameKey> {
    const response = await instanse<GameKey>({
      method: 'PATCH',
      url: `/admin/game-keys/${keyId}`,
      data: {
        is_used: isUsed,
      }
    });
    return response.data;
  },
};