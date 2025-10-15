<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, user, logout } from '../../stores/auth.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let currentUser: any = null;

	onMount(() => {
		const unsubscribeAuth = isAuthenticated.subscribe(($isAuthenticated) => {
			if (!$isAuthenticated) {
				goto('/');
			}
		});

		const unsubscribeUser = user.subscribe(($user) => {
			currentUser = $user;
		});

		return () => {
			unsubscribeAuth();
			unsubscribeUser();
		};
	});

	const handleLogout = () => {
		logout();
	};
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
					>
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-slate-800 sm:text-3xl">Dashboard</h1>
						<p class="mt-1 text-slate-600">Welcome to your secure area</p>
					</div>
				</div>
				<Button
					onclick={handleLogout}
					variant="outline"
					class="border-red-200 text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					Sign Out
				</Button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- User Information Card -->
			<div class="space-y-6 lg:col-span-2">
				{#if currentUser}
					<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
						<div class="mb-6 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
							>
								<span class="text-sm font-semibold text-white">
									{currentUser.given_name?.[0]}{currentUser.family_name?.[0]}
								</span>
							</div>
							<div>
								<h2 class="text-xl font-semibold text-slate-800">User Profile</h2>
								<p class="text-sm text-slate-600">Your account information</p>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-1">
								<label class="text-xs font-medium tracking-wide text-slate-500 uppercase"
									>Username</label
								>
								<div
									class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
								>
									<svg
										class="h-4 w-4 text-slate-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									<span class="font-medium text-slate-800"
										>{currentUser.preferred_username || 'N/A'}</span
									>
								</div>
							</div>

							<div class="space-y-1">
								<label class="text-xs font-medium tracking-wide text-slate-500 uppercase"
									>Email</label
								>
								<div
									class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
								>
									<svg
										class="h-4 w-4 text-slate-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									<span class="font-medium text-slate-800">{currentUser.email}</span>
								</div>
							</div>

							<div class="space-y-1">
								<label class="text-xs font-medium tracking-wide text-slate-500 uppercase"
									>First Name</label
								>
								<div
									class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
								>
									<svg
										class="h-4 w-4 text-slate-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									<span class="font-medium text-slate-800">{currentUser.given_name || 'N/A'}</span>
								</div>
							</div>

							<div class="space-y-1">
								<label class="text-xs font-medium tracking-wide text-slate-500 uppercase"
									>Last Name</label
								>
								<div
									class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
								>
									<svg
										class="h-4 w-4 text-slate-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									<span class="font-medium text-slate-800">{currentUser.family_name || 'N/A'}</span>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Protected Content Card -->
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600"
						>
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<div>
							<h2 class="text-xl font-semibold text-slate-800">Protected Content</h2>
							<p class="text-sm text-slate-600">Secure area access granted</p>
						</div>
					</div>

					<div
						class="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6"
					>
						<div class="flex items-start gap-4">
							<div class="flex-shrink-0">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600"
								>
									<svg
										class="h-6 w-6 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
							</div>
							<div>
								<h3 class="mb-2 text-lg font-semibold text-slate-800">Access Granted</h3>
								<p class="leading-relaxed text-slate-600">
									You have successfully authenticated and are now viewing protected content. This
									area is only accessible to users with valid credentials.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Sidebar Stats -->
			<div class="space-y-6">
				<!-- Session Info -->
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
					<h3 class="mb-4 font-semibold text-slate-800">Session Information</h3>
					<div class="space-y-3">
						<div class="flex items-center justify-between border-b border-slate-100 py-2">
							<span class="text-sm text-slate-600">Status</span>
							<span
								class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
							>
								<div class="h-2 w-2 rounded-full bg-green-500"></div>
								Active
							</span>
						</div>
						<div class="flex items-center justify-between border-b border-slate-100 py-2">
							<span class="text-sm text-slate-600">User ID</span>
							<span class="font-mono text-sm text-slate-800"
								>{currentUser?.sub?.substring(0, 8)}...</span
							>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-slate-600">Realm</span>
							<span class="text-sm font-medium text-slate-800">myrealm</span>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
					<h3 class="mb-4 font-semibold text-slate-800">Quick Actions</h3>
					<div class="space-y-3">
						<Button class="w-full justify-start gap-2" variant="outline">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Account Settings
						</Button>
						<Button class="w-full justify-start gap-2" variant="outline">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Create New
						</Button>
						<Button class="w-full justify-start gap-2" variant="outline">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							View Reports
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
