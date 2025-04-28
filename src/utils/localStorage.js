import authConfig from 'src/configs/auth'

// Access Token
export function getAccessToken() {
  return window.localStorage.getItem(authConfig.storageTokenKeyName)
}

export function setAccessToken(payload) {
  return window.localStorage.setItem(authConfig.storageTokenKeyName, payload)
}

export function removeAccessToken() {
  return window.localStorage.removeItem(authConfig.storageTokenKeyName)
}

// Refresh Token
export function getRefreshToken() {
  return window.localStorage.getItem(authConfig.onTokenExpiration)
}

export function setRefreshToken(payload) {
  return window.localStorage.setItem(authConfig.onTokenExpiration, payload)
}

export function removeRefreshToken() {
  return window.localStorage.removeItem(authConfig.onTokenExpiration)
}

// User data
export function getUserData() {
  return window.localStorage.getItem(authConfig.userData)
}

export function setUserData(payload) {
  return window.localStorage.setItem(authConfig.userData, payload)
}

export function removeUserData() {
  return window.localStorage.removeItem(authConfig.userData)
}
