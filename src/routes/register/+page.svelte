<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
		CardFooter
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { createEventDispatcher } from 'svelte';
	import { User, Mail, Lock } from '@lucide/svelte';

	const dispatch = createEventDispatcher();

	let username = '';
	let email = '';
	let firstName = '';
	let lastName = '';
	let password = '';
	let confirmPassword = '';
	let error: string | null = null;
	let loading = false;

	const validate = () => {
		if (!username.trim()) return 'Username is required';
		if (!email.trim()) return 'Email is required';
		// basic email check
		if (!/^\S+@\S+\.\S+$/.test(email)) return 'Email is invalid';
		if (password.length < 8) return 'Password must be at least 8 characters';
		if (password !== confirmPassword) return 'Passwords do not match';
		return null;
	};

	const onSubmit = async (e: Event) => {
		e.preventDefault();
		error = null;
		const v = validate();
		if (v) {
			error = v;
			return;
		}

		loading = true;
		try {
			// emit event for parent to handle actual registration (e.g., call backend / keycloak)
			dispatch('register', { firstName, lastName, username, email, password });
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex h-screen min-h-[70vh] w-screen items-center justify-center p-6">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Register</CardTitle>
			<CardDescription>Create a new account</CardDescription>
		</CardHeader>

		<form on:submit|preventDefault={onSubmit}>
			<CardContent class="grid gap-4">
				{#if error}
					<div class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
				{/if}

				<div class="grid gap-1">
					<Label for="username"
						><span class="flex items-center gap-2 pl-2"><User class="h-4 w-4" />Username</span
						></Label
					>
					<Input id="username" bind:value={username} name="username" placeholder="your username" />
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-1">
						<Label for="firstName"
							><span class="flex items-center gap-2 pl-2"><User class="h-4 w-4" />First Name</span
							></Label
						>
						<Input
							id="firstName"
							bind:value={firstName}
							name="firstName"
							placeholder="First name"
						/>
					</div>

					<div class="grid gap-1">
						<Label for="lastName"
							><span class="flex items-center gap-2 pl-2"><User class="h-4 w-4" />Last Name</span
							></Label
						>
						<Input id="lastName" bind:value={lastName} name="lastName" placeholder="Last name" />
					</div>
				</div>

				<div class="grid gap-1">
					<Label for="email"
						><span class="flex items-center gap-2 pl-2"><Mail class="h-4 w-4" />Email</span></Label
					>
					<Input
						id="email"
						type="email"
						bind:value={email}
						name="email"
						placeholder="you@example.com"
					/>
				</div>

				<div class="grid gap-1">
					<Label for="password"
						><span class="flex items-center gap-2 pl-2"><Lock class="h-4 w-4" />Password</span
						></Label
					>
					<Input
						id="password"
						type="password"
						bind:value={password}
						name="password"
						placeholder="password"
					/>
				</div>

				<div class="grid gap-1">
					<Label for="confirmPassword"
						><span class="flex items-center gap-2 pl-2"
							><Lock class="h-4 w-4" />Confirm Password</span
						></Label
					>

					<Input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						name="confirmPassword"
						placeholder="confirm password"
					/>
				</div>
			</CardContent>

			<CardFooter class="flex flex-col gap-3">
				<div class="mt-4 flex w-full">
					<Button class="w-full py-3" type="submit" disabled={loading}>
						{#if loading}Registering...{:else}Register{/if}
					</Button>
				</div>

				<div class="text-center text-sm">
					<a href="/" class="text-muted-foreground hover:underline"
						>Already have an account? Log in</a
					>
				</div>
			</CardFooter>
		</form>
	</Card>
</div>
