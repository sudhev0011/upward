import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { createProviderProfileController, getProviderProfileController, updateProviderProfileController, providerProfileController } from "../../infrastructure/di/provider.Di";
import { UserBlockedMiddleware } from "../middleware/user-blocked.middleware";
import { getUserByIdUseCase } from "../../infrastructure/di/authDi";
export class ProviderRouter{

    public router: Router;

    constructor(){
        this.router = Router();
        this._initializeRoutes();
    }

    private _initializeRoutes(): void{
        const userBlockedMiddleware = new UserBlockedMiddleware(getUserByIdUseCase);

        this.router.use(authenticateToken);
        this.router.use(authorizeRoles('provider'));
        this.router.use(userBlockedMiddleware.checkUserBlocked);


        this.router.post('/profile', createProviderProfileController.execute);
        this.router.get('/profile', getProviderProfileController.execute);
        this.router.put('/profile', updateProviderProfileController.execute);
        this.router.post('/profile-upload-url', providerProfileController.uploadAvatar);
    }
}