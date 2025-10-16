import Keycloak from 'keycloak-js';

//this file creates and initializes the keycloak js client instance using the oficial keycloak-js adapter
//Defines how our app should connect to the keycloak server + provides helper functions for client initialization and use

const keycloakConfig = {
	url: 'http://localhost:8080/', //base URL -> only for development change in prod
	realm: 'myrealm',
	clientId: 'myclient'
};

const keycloak = new Keycloak(keycloakConfig); // keycloak client instantiation which serves as main interface for managing everything keycloak-token related

export const initKeycloak = async () => {
	try {
		//NOTE: Use check-sso to avoid automatic redirect to keycloaks login form
		const authenticated = await keycloak.init({
			onLoad: 'check-sso', //checks if the user is already signed-in through single sign-on
			pkceMethod: 'S256', //Proof Key for code exchange
			checkLoginIframe: false, //Disables the background iframe that keycloak uses to check login status
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

// Helper function for direct login with credentials
export const loginWithCredentials = async (
	/** @type {any} */ username,
	/** @type {any} */ password
) => {
	try {
		// IMPORTANT:This requires Direct Grant to be enabled in Keycloak
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
