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
	import { CheckCircle, AlertTriangle } from '@lucide/svelte';
	import { User, Mail, Lock, Eye, EyeOff, UserRoundPlus, UserRoundPen } from '@lucide/svelte';

	const dispatch = createEventDispatcher();

	let username = '';
	let email = '';
	let firstName = '';
	let lastName = '';
	let password = '';
	let confirmPassword = '';
	let showPassword = false;
	let showConfirm = false;
	let error: string | null = null;
	let success: string | null = null;
	let loading = false;
	let redirecting = false;

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
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password, firstName, lastName })
			});

			if (res.ok) {
				success = 'Account has been successfully created. Redirecting to login...';
				// clear any previous error
				error = null;
				redirecting = true;
				// wait 2 seconds then redirect to login
				setTimeout(() => (window.location.href = '/'), 2000);
			} else if (res.status === 409) {
				// user already exists
				error = 'A user with that username or email already exists.';
				success = null;
				return;
			} else {
				const txt = await res.text();
				throw new Error(txt || 'Registration failed');
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex h-screen min-h-[70vh] w-screen items-center justify-center p-6">
	<Card class="w-full max-w-md">
		{#if redirecting}
			<div class="redirecting text-sm text-muted-foreground">
				Redirecting<span class="dots"></span>
			</div>
		{/if}
		<CardHeader>
			<div class="flex items-center gap-2">
				<UserRoundPlus class="h-5 w-5" />
				<CardTitle>Register</CardTitle>
			</div>
			<CardDescription>Create a new account</CardDescription>
		</CardHeader>

		<form on:submit|preventDefault={onSubmit}>
			<CardContent class="grid gap-4">
				{#if error}
					<div class="mb-4 rounded-md bg-destructive/10 px-3 py-3 text-sm text-destructive">
						<div class="flex items-start gap-3">
							<AlertTriangle class="h-5 w-5 shrink-0 text-destructive" />
							<div>
								<div class="font-medium">Registration failed</div>
								<div class="text-sm text-destructive/80">{error}</div>
							</div>
						</div>
					</div>
				{/if}

				{#if success}
					<div class="mb-4 rounded-md bg-green-50 px-3 py-3 text-sm text-green-700">
						<div class="flex items-start gap-3">
							<CheckCircle class="h-5 w-5 shrink-0 text-green-600" />
							<div>
								<div class="font-medium">Successful registration</div>
								<div class="text-sm text-green-700/80">{success}</div>
							</div>
						</div>
					</div>
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
							><span class="flex items-center gap-2 pl-2"
								><UserRoundPen class="h-4 w-4" />First Name</span
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
							><span class="flex items-center gap-2 pl-2"
								><UserRoundPen class="h-4 w-4" />Last Name</span
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
					<div class="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							name="password"
							placeholder="password"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-2 -translate-y-1/2 p-1 hover:cursor-pointer"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							on:click={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4" />
							{:else}
								<Eye class="h-4 w-4" />
							{/if}
						</button>
					</div>
				</div>

				<div class="grid gap-1">
					<Label for="confirmPassword"
						><span class="flex items-center gap-2 pl-2"
							><Lock class="h-4 w-4" />Confirm Password</span
						></Label
					>

					<div class="relative">
						<Input
							id="confirmPassword"
							type={showConfirm ? 'text' : 'password'}
							bind:value={confirmPassword}
							name="confirmPassword"
							placeholder="confirm password"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-2 -translate-y-1/2 p-1 hover:cursor-pointer"
							aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
							on:click={() => (showConfirm = !showConfirm)}
						>
							{#if showConfirm}
								<EyeOff class="h-4 w-4" />
							{:else}
								<Eye class="h-4 w-4" />
							{/if}
						</button>
					</div>
				</div>
			</CardContent>

			<CardFooter class="flex flex-col gap-3">
				<div class="mt-4 flex w-full">
					<Button class="w-full py-3 hover:cursor-pointer" type="submit" disabled={loading}>
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

<style>
	.redirecting {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.75rem;
	}

	.dots {
		display: inline-block;
		width: 1ch;
		text-align: left;
	}

	.dots::after {
		content: '\00a0\00a0\00a0';
		animation: dots 1s steps(3, end) infinite;
	}

	@keyframes dots {
		0%,
		20% {
			content: '\00a0';
		}
		40% {
			content: '\00a0\00a0';
		}
		60%,
		100% {
			content: '\00a0\00a0\00a0';
		}
	}
</style>
