import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import keycloak, { initKeycloak } from '$lib/keycloak.js';

// stores for holding app state
export const isAuthenticated = writable(false);
export const user = writable(null);
export const token = writable(null);

//Ensures the code only runs in browser, since our target auth service is browser focused
export const initializeAuth = async () => {
	if (!browser) return;

	try {
		// Initialize keycloak and sets our auth state
		const authenticated = await initKeycloak();
		isAuthenticated.set(authenticated);

		if (authenticated) {
			// @ts-ignore
			user.set(keycloak.tokenParsed); // decoded token payload
			// @ts-ignore
			token.set(keycloak.token); //raw keycloak-jwt token
		}

		// Token auto-refresh every 30s
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

// Helper Functions -> triggers keycloaks built in onboarding functions

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
