import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { clientProfileController } from "../../infrastructure/di/clientDi";
export class ClientRouter{

    public router: Router;

    constructor(){
        this.router = Router();
        this._initializeRoutes();
    }

    private _initializeRoutes(): void{

        this.router.use(authenticateToken);

        this.router.post('/profile', clientProfileController.createClientProfile);
        this.router.get('/profile', clientProfileController.getClientProfile);
        this.router.put('/profile', clientProfileController.updateClientProfile);
        this.router.post('/profile-upload-url', clientProfileController.uploadAvatar);
    }
}