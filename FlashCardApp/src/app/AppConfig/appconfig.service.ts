import { InjectionToken } from "@angular/core";
import { Appconfig } from "./appconfig.interface";
import { environment } from "../../environment/environment";

export const APP_SERVICE_CONFIG = new InjectionToken<Appconfig>('app.config')

export const APP_CONFIG: Appconfig = {
    apiEndpoint: environment.apiEndPoint,
    firebaseConfig: environment.firebaseConfig
}