export enum SauceUser {
  STANDARD = "standard_user",
  LOCKED = "locked_out_user",
  PROBLEM = "problem_user",
  PERFORMANCE = "performance_glitch_user",
  ERROR = "error_user",
  VISUAL = "visual_user",
  INVALID = "invalid_user"
}

export enum SauceCredential {
  PASSWORD = "secret_sauce",
  WRONG_PASSWORD = "wrong_password"
}

export enum ProductName {
  BACKPACK = "Sauce Labs Backpack"
}

export enum CheckoutInputValue {
  FIRST_NAME = "Demo",
  LAST_NAME = "User",
  POSTAL_CODE = "10001",
  EMPTY = ""
}

export enum UiText {
  PRODUCTS = "Products",
  LOGIN = "Login",
  CHECKOUT = "Checkout",
  CONTINUE = "Continue",
  FINISH = "Finish",
  OPEN_MENU = "Open Menu",
  LOGOUT_SIDEBAR_LINK = "Logout",
  CHECKOUT_SUCCESS = "Thank you for your order!",
  LOGIN_ERROR_PREFIX = "Epic sadface:",
  INVALID_CREDENTIALS_ERROR = "Epic sadface: Username and password do not match any user in this service",
  LOCKED_USER_ERROR = "Epic sadface: Sorry, this user has been locked out.",
  CHECKOUT_ERROR_PREFIX = "Error:",
  FIRST_NAME_REQUIRED_ERROR = "Error: First Name is required",
  LAST_NAME_REQUIRED_ERROR = "Error: Last Name is required",
  POSTAL_CODE_REQUIRED_ERROR = "Error: Postal Code is required"
}

export enum UrlPath {
  LOGIN = "/",
  INVENTORY = "/inventory.html",
  CART = "/cart.html",
  CHECKOUT_STEP_ONE = "/checkout-step-one.html",
  CHECKOUT_STEP_TWO = "/checkout-step-two.html",
  CHECKOUT_COMPLETE = "/checkout-complete.html"
}
