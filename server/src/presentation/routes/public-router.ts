import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { publicCategoryController, publicServiceController } from "../../infrastructure/di/publicDi";

export class PublicRouter{

    public router: Router;

    constructor(){
        this.router = Router();
        this._initializeRoutes();
    }

    private _initializeRoutes(): void{

        this.router.use(authenticateToken);

        this.router.get('/categories', publicCategoryController.getAllCategories);
        this.router.get('/services', publicServiceController.getAllService);
        this.router.get('/services/:categoryId', publicServiceController.getServicesByCategory);
        
    }
}