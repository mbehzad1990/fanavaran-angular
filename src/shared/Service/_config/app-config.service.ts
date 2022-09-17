import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, map, of, shareReplay, Subscription } from 'rxjs';
import { AppConfiguration } from 'src/shared/Domain/Models/_AppConfig/app-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService implements OnDestroy {

  private _unsubscribe: Subscription[] = [];

  private _appConfig$ = new BehaviorSubject<AppConfiguration>(null!);
  get appConfig$() {
    return this._appConfig$.asObservable();
  }
  constructor(private _http: HttpClient) { 
  }
  ngOnDestroy(): void {
    this._unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  loadConfig() {
    const sb = this._http.get('assets/config/config.json')
      .pipe(
        map((result: any) => {
          let _appConfig = new AppConfiguration();
          _appConfig.operationDateControl = result.operationDateControl;
          _appConfig.serverUrl = result.serverUrl;
          this._appConfig$.next(_appConfig);
        }),
        catchError((err) => {
          console.error('Could not load configuration');

          return of(new AppConfiguration());
        }),
        shareReplay()
      ).subscribe();
      this._unsubscribe.push(sb);
  }
}
