import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { routeConfig } from './routes';
import { provideRouter } from '@angular/router';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routeConfig),
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [
          { name: 'required', message: 'This field is required' },
        ],
      },
    ]),
    importProvidersFrom(HttpClientModule) 
  ],
};
