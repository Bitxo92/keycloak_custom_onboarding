import { json } from '@sveltejs/kit';

// Keycloak server configuration
const KEYCLOAK_URL = 'http://localhost:8080/';
const REALM = 'myrealm';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';
const CLIENT_ID = 'myclient';

// Function to get admin access token necessary for user creation
async function getAdminToken() {
  const res = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: CLIENT_ID,
      username: ADMIN_USER,
      password: ADMIN_PASS
    })
  });
  const data = await res.json();
  return data.access_token;
}

// POST endpoint to handle user registration
export async function POST({ request }) {
  const { username, email, password, firstName, lastName } = await request.json();
  const token = await getAdminToken();

  const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      firstName,
      lastName,
      enabled: true,
      credentials: [{ type: 'password', value: password, temporary: false }]
    })
  });

  if (res.status === 201) {
    return json({ success: true });
  } else {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }
}
