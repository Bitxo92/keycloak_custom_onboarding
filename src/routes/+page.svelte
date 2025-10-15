<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { isAuthenticated, user, token } from '../stores/auth.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import keycloak from '$lib/keycloak.js';

	let email = '';
	let password = '';
	let isLoading = false;
	let error = '';

	onMount(() => {
		const unsubscribe = isAuthenticated.subscribe(($isAuthenticated: any) => {
			if ($isAuthenticated) {
				goto('/protected');
			}
		});

		return () => unsubscribe();
	});

	// True custom form login without redirects
	const handleCustomLogin = async (e: Event) => {
		e.preventDefault();

		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}

		isLoading = true;
		error = '';

		try {
			// Use fetch with credentials -> IMPORTANT: this requires CORS to be properly configured
			const response = await fetch(
				`http://localhost:8080/realms/myrealm/protocol/openid-connect/token`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						client_id: 'myclient',
						grant_type: 'password',
						username: email,
						password: password,
						scope: 'openid'
					})
				}
			);

			if (response.ok) {
				const data = await response.json();

				// Manually update Keycloak instance
				keycloak.token = data.access_token;
				keycloak.refreshToken = data.refresh_token;
				keycloak.idToken = data.id_token;
				keycloak.authenticated = true;
				keycloak.tokenParsed = JSON.parse(atob(data.access_token.split('.')[1]));

				// Update stores
				isAuthenticated.set(true);
				//@ts-ignore
				user.set(keycloak.tokenParsed);
				token.set(data.access_token);

				// Redirect to protected page
				goto('/protected');
			} else {
				const errorData = await response.json();
				error = errorData.error_description || 'Login failed';
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'Login failed. Check console for details.';
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Login to your account</Card.Title>
			<Card.Description>Enter your credentials below</Card.Description>
		</Card.Header>
		<Card.Content>
			<form on:submit={handleCustomLogin}>
				<div class="flex flex-col gap-6">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							bind:value={email}
							required
							disabled={isLoading}
						/>
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<a href="##" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<Input
							id="password"
							type="password"
							bind:value={password}
							required
							disabled={isLoading}
						/>
					</div>

					{#if error}
						<div class="rounded bg-red-50 p-2 text-sm text-red-500">{error}</div>
					{/if}
				</div>
			</form>
		</Card.Content>
		<Card.Footer class="flex-col gap-2">
			<Button onclick={handleCustomLogin} class="hover: w-full cursor-pointer" disabled={isLoading}>
				{isLoading ? 'Logging in...' : 'Login'}
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
