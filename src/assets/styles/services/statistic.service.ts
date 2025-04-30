
import { IReview } from '@/src/types/review.intefrace';
import { instanse } from '../api/api.interceptor';



const STATISTICS = 'statistics'

export type TypeStatisticResponse = {
name: string
value: number
} []

export const StatisticService = {
    async main() {
        return instanse <TypeStatisticResponse>({
            url: `${STATISTICS}/main`,
            method: 'GET'
        })
    },
}


