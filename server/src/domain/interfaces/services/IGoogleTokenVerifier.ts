
export interface IGoogleProfile{
    email: string
    name: string
    picture: string
    emailVerified: boolean
}

export interface IGoogleTokenVerifier{

    verifyIdToken(idToken: string): Promise<IGoogleProfile>
}