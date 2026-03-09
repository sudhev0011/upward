import { OAuth2Client } from "google-auth-library";
import { IGoogleProfile, IGoogleTokenVerifier } from "../../domain/interfaces/services/IGoogleTokenVerifier";
import { env } from "../config/env";


export class GoogleTokenVerifier implements IGoogleTokenVerifier{
    private _client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

    async verifyIdToken(idToken: string): Promise<IGoogleProfile> {
        
        const ticket = await this._client.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if(!payload || !payload.email){
            throw new Error('Invalid Google Token');
        }

        return {
            email : payload.email,
            name : payload.name || '',
            picture : payload.picture || '',
            emailVerified : Boolean(payload.email_verified),
        }
    }
}