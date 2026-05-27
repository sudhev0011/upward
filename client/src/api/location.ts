import { LocationRoutes } from "@/constants/api-routes"
import { api } from "./axios"

export const locationApi = {

    async searchLocations(query: string){
        return (await api.get(LocationRoutes.GET_LOCATION,{params: {query}})).data
    },

    async getPlaceDetails(placeId: string){
        return (await api.get(LocationRoutes.GET_LOCATION_DETAILS,{params: {placeId}})).data
    }
}