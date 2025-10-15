import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import keycloak, { initKeycloak } from '$lib/keycloak.js';

export const isAuthenticated = writable(false);
export const user = writable(null);
export const token = writable(null);

export const initializeAuth = async () => {
	if (!browser) return;

	try {
		const authenticated = await initKeycloak();
		isAuthenticated.set(authenticated);

		if (authenticated) {
			// @ts-ignore
			user.set(keycloak.tokenParsed);
			// @ts-ignore
			token.set(keycloak.token);
		}

		// Update token before it expires
		keycloak.onTokenExpired = () => {
			keycloak.updateToken(30).then((refreshed) => {
				if (refreshed) {
					// @ts-ignore
					token.set(keycloak.token);
					// @ts-ignore
					user.set(keycloak.tokenParsed);
				}
			});
		};
	} catch (error) {
		console.error('Failed to initialize Keycloak', error);
		isAuthenticated.set(false);
	}
};

export const login = () => {
	if (browser) {
		keycloak.login();
	}
};

export const logout = () => {
	if (browser) {
		keycloak.logout();
	}
};

export const getToken = () => {
	return keycloak.token;
};
