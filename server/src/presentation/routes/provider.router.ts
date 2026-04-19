import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { providerProfileController, kycController } from "../../infrastructure/di/provider.Di";
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


        this.router.post('/profile', providerProfileController.createProviderProfile);
        this.router.get('/profile', providerProfileController.getProviderProfile);
        this.router.put('/profile', providerProfileController.updateProviderProfile);
        this.router.post('/profile-upload-url', providerProfileController.uploadAvatar);

        this.router.post('/kyc/identity', kycController.submitProviderKyc);
        this.router.get('/kyc/identity', kycController.getProviderKyc);
        this.router.post('/kyc/bank', kycController.saveProviderBank);// bacnk info saving to db after document upload
        this.router.get('/kyc/bank', kycController.getProviderBank);
        this.router.post('/media/kyc-document', kycController.uploadProviderKyc);// uploading url generating controller


    }
}