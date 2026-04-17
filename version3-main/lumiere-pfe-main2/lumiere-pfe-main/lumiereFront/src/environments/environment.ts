// ⚠️ Modifier uniquement cette ligne pour changer l'adresse IP du backend
const BASE_URL = 'http://192.168.1.70:8090';

export const environment = {
    production: false,

    baseUrl: BASE_URL,

    apiUrl: `${BASE_URL}/api`,
    authUrl: `${BASE_URL}/api/v1/auth`,
    adminUrl: `${BASE_URL}/api/v1/admin`,
    demoUrl: `${BASE_URL}/api/v1/demo`
};
