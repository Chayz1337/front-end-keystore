import { AuthService } from '@/src/assets/styles/services/auth/auth.service';
import { IAuthResponse, IEmailPassword } from './user.interface';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { removeFromStorage } from '@/src/assets/styles/services/auth/auth.helper';
import { errorCatch } from '@/src/assets/styles/api/api.helper';
export const register = createAsyncThunk<IAuthResponse, IEmailPassword> (
    'auth/register',
    async(data,thunkApi) => {
        try{
            const response = await AuthService.mainModule('register', data)
            return response
        }
        catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

/* login */
export const login = createAsyncThunk<IAuthResponse, IEmailPassword> (
    'auth/login',
    async(data,thunkApi) => {
        try{
            const response = await AuthService.mainModule('login', data)
            return response
        }
        catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)

/* logout */
export const logout = createAsyncThunk('auth/logout', async () => {
    removeFromStorage()
})

export const checkAuth = createAsyncThunk<IAuthResponse>( 'auth/check-auth',
     async (_, thunkApi) => {
        try{
            const response = await AuthService.getNewTokens()
            return response.data}
            catch (error) {
                if (errorCatch(error) == 'jwt expired') {
                    thunkApi.dispatch(logout())
                }
return thunkApi.rejectWithValue(error)
            }
        }
     )