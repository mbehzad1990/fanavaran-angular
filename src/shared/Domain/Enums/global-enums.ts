export enum ResultAction {
  ExceptionFaild = 0,
  ActionFaild,
  NoSeed,
  Success,
  UserNotExist,
  UserPasswordNotCorrect,
  UserTokenNotFound,
  UserRefeshTokenExpired,
  UserAlreadyExist,
  SaveUserTokenFailed,
  CanNotSignInUser,
  CanNotGenerateJWTToken,
  CanNotGenerateRefreshToken,
  UpdateRefreshTokenForCurrentUser,
  AddRefreshTokenInDb,
  StockNotExist,
  StockAlreadyAdded,
  ClientNotExist,
  UnitNotExist,
  ClientAlreadyExist,
  GoodNameAlreadyRegister,
  GoodNotExist,
  StockOperationNotExist,
  StockOperationHasRefId,
  UpdateOperaionDetailsFailed,
  UnitAlreadyExist,
  GoodManuelIdAlreadyUse,
  GoodAlreadyUseInRemittance,
  PersonAlreadyUseInRemittance,
  StockAlreadyUseInRemittance,
  ManuelIdAlreadyUseInRemittance,
  CannotInsertDataForOtherDay,
  DateFormatIncorect,
  ServiceException
}

export enum NotificationType {
  Success,
  Error,
  Warning,
}
export enum ResultType {
  None = 0,
  Successfully = 1,
  warning = 2,
  error = 3,
  Critical = 4,
  Info = 5,
}
export enum DeleteOperationType {
  User,
  Stock,
  Unit,
  Good,
  Operation
}

export enum ActionType {
  Add,
  Update,
  Delete,
  ShowDetails
}

export enum StockOperationType {
  Sell,
  Buy,
  ReSell,
  ReBuy,
  Damage
}
export enum serachRemittanceController {
  isDropDownShow,
  isTextBoxShow,
  isDateBoxShow,
}
