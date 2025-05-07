// src/services/game-key.service.ts
import { GameKey } from '@/src/types/game-key.interface';
import { axiosClassic, instanse } from '../../api/api.interceptor';

export const gameKeyService = {
    /** Публичный маршрут, не требует авторизации */
    async getGameKeys(gameId: number): Promise<GameKey[]> {
      const response = await axiosClassic.get<GameKey[]>(`/admin/game-keys/${gameId}`);
      return response.data;
    },
  
    async createGameKeys(gameId: number, activationKeys: string[]) {
      const response = await instanse.post(`/admin/game-keys`, {
        game_id: gameId,
        activation_keys: activationKeys
      })
      return response.data
    },

  async updateGameKeyUsage(keyId: number, isUsed: boolean): Promise<GameKey> {
    const response = await instanse.patch<GameKey>(`/admin/game-keys/${keyId}`, {
      is_used: isUsed,
    });
    return response.data;
  },
};