import { HttpInterceptorFn } from "@angular/common/http";
import { StorageService } from "../services/storage.service";
import { inject } from "@angular/core";




export const authInterceptor: HttpInterceptorFn = (req, next) => {
    
  const storage = inject(StorageService);
  const token   = storage.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};