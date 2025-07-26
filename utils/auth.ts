
export const getAuthToken = () => {
    if (import.meta.server) return null;
    return localStorage.getItem('token');
};


export const setAuthToken = (token: string) => {
    if (import.meta.server) return;
    localStorage.setItem('token', token);
};


export const removeAuthToken = () => {
    if (import.meta.server) return;
    localStorage.removeItem('token');
};
