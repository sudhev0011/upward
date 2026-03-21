import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { createProviderProfileController, getProviderProfileController, updateProviderProfileController } from "../../infrastructure/di/provider.Di";

export class ProviderRouter{

    public router: Router;

    constructor(){
        this.router = Router();
        this._initializeRoutes();
    }

    private _initializeRoutes(): void{

        this.router.use(authenticateToken);

        this.router.post('/profile', createProviderProfileController.execute);
        this.router.get('/profile', getProviderProfileController.execute);
        this.router.put('/profile', updateProviderProfileController.execute);
    }
}