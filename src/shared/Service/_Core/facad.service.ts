import { CustomerService } from './../_customer/customer.service';
import { SaleService } from './../_sale/sale.service';
import { BuyService } from './../_buy/buy.service';
import { UserService } from './../_user/user.service';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { NotificationService } from '../_notification/notification.service';
import { ErrorHandlerService } from '../_errorHandler/error-handler.service';
import { PersianCalenderService } from '../_utility/persian-calender.service';
import { StockService } from '../_stock/stock.service';
import { UnitService } from '../_unit/unit.service';
import { GoodService } from '../_good/good.service';

@Injectable({
  providedIn: 'root'
})
export class FacadService {

  constructor(private injector: Injector) { }

  private _auth!: AuthService;
  public get auth(): AuthService {
    if (!this._auth) {
      this._auth = this.injector.get(AuthService);
    }
    return this._auth;
  }


  private _user!: UserService;
  public get user(): UserService {
    if (!this._user) {
      this._user = this.injector.get(UserService);
    }
    return this._user;
  }

  private _buy!: BuyService;
  public get buy(): BuyService {
    if (!this._buy) {
      this._buy = this.injector.get(BuyService);
    }
    return this._buy;
  }

  private _sale!: SaleService;
  public get sale(): SaleService {
    if (!this._sale) {
      this._sale = this.injector.get(SaleService);
    }
    return this._sale;
  }

  private _customer!: CustomerService;
  public get customer(): CustomerService {
    if (!this._customer) {
      this._customer = this.injector.get(CustomerService);
    }
    return this._customer;
  }
  private _notification!: NotificationService;
  public get notification(): NotificationService {
    if (!this._notification) {
      this._notification = this.injector.get(NotificationService);
    }
    return this._notification;
  }
  private _errorHandler!: ErrorHandlerService;
  public get errorHandler(): ErrorHandlerService {
    if (!this._errorHandler) {
      this._errorHandler = this.injector.get(ErrorHandlerService);
    }
    return this._errorHandler;
  }
  private _persianCalender!: PersianCalenderService;
  public get persianCalender(): PersianCalenderService {
    if (!this._persianCalender) {
      this._persianCalender = this.injector.get(PersianCalenderService);
    }
    return this._persianCalender;
  }
  private _stock!: StockService;
  public get stock(): StockService {
    if (!this._stock) {
      this._stock = this.injector.get(StockService);
    }
    return this._stock;
  }
  private _unit!: UnitService;
  public get unit(): UnitService {
    if (!this._unit) {
      this._unit = this.injector.get(UnitService);
    }
    return this._unit;
  }
  private _good!: GoodService;
  public get good(): GoodService {
    if (!this._good) {
      this._good = this.injector.get(GoodService);
    }
    return this._good;
  }
}
