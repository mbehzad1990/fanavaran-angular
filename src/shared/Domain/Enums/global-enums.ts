export enum ResultAction {
    ExceptionFaild,
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
  }
  
  export enum ActionType {
    Add,
    Update,
    Delete
  }
  
  export enum StockOperationType{
    Sell,
    Buy,
    ReSell,
    ReBuy,
    Damage
  }