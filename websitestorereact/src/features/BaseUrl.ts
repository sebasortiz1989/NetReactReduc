const isLocalhost = window.location.hostname === 'localhost';
const protocol = isLocalhost ? 'https' : 'http';
const port = isLocalhost ? '5005' : '5010';
export const baseUrl = `${protocol}://${window.location.hostname}:${port}/api`;