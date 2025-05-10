import { IUser } from "@/src/types/user.interface"

export interface IUserState {
    email: string
    isAdmin?: boolean
    role?:string
}


export interface ITokens {
    accessToken: string
    refreshToken: string
}

export interface IInitialState {
    user: IUserState | null
    isLoading: boolean
    error?: string | null;
}

export interface IEmailPassword {
    email: string
    password: string
}

export interface IAuthResponse extends ITokens {
    user: IUser
}