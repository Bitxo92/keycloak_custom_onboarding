import Keycloak from 'keycloak-js';

const keycloakConfig = {
	url: 'http://localhost:8080/',
	realm: 'myrealm',
	clientId: 'myclient'
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = async () => {
	try {
		//NOTE: Use check-sso to avoid automatic redirect to keycloaks login form
		const authenticated = await keycloak.init({
			onLoad: 'check-sso',
			pkceMethod: 'S256',
			checkLoginIframe: false,
			silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
		});

		console.log('Keycloak initialized, authenticated:', authenticated);

		if (authenticated) {
			console.log('User:', keycloak.tokenParsed);
		}

		return authenticated;
	} catch (error) {
		console.error('Keycloak initialization failed:', error);
		return false;
	}
};

// Helper function for login with credentials
export const loginWithCredentials = async (
	/** @type {any} */ username,
	/** @type {any} */ password
) => {
	try {
		// NOTE:This requires Direct Grant to be enabled in Keycloak
		const authenticated = await keycloak.login({
			loginHint: username,
			action: 'login'
		});
		return authenticated;
	} catch (error) {
		console.error('Login with credentials failed:', error);
		throw error;
	}
};

export default keycloak;
