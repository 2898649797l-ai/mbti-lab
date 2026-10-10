// Share the current deployment, including its base path, without a result hash.
export const APP_URL = new URL(import.meta.env.BASE_URL, window.location.origin).href
