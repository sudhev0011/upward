import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { createClientProfileController } from "../../infrastructure/di/clientDi";
import { getClientProfileController } from "../../infrastructure/di/clientDi";
import { updateClientProfileController } from "../../infrastructure/di/clientDi";
import { clientProfileController } from "../../infrastructure/di/clientDi";
export class ClientRouter{

    public router: Router;

    constructor(){
        this.router = Router();
        this._initializeRoutes();
    }

    private _initializeRoutes(): void{

        this.router.use(authenticateToken);

        this.router.post('/profile', createClientProfileController.execute);
        this.router.get('/profile', getClientProfileController.execute);
        this.router.put('/profile', updateClientProfileController.execute);
        this.router.post('/profile-upload-url', clientProfileController.uploadAvatar);
    }
}