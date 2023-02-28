<script lang="ts">
	import { scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';

	let step = 0;

	let sequences = [
		{
			sound: 'kippa',
			sequence: [false, false, false, false, false, false]
		},
		{
			sound: 'kappa',
			sequence: [false, false, false, false, false, false]
		},
		{
			sound: 'koppa',
			sequence: [false, false, false, false, false, false]
		}
	];
</script>

<div class="relative min-h-screen flex flex-col">
	<section class="flex-1">
		<div>Kappa</div>
	</section>

	<hr class="border-t-2 border-gray-200" />

	<button class="absolute">Kappa</button>

	<section class="flex justify-center py-12 pb-20 bg-gray-100 shadow-inner">
		<div class="mx-4 flex flex-col w-full max-w-2xl">
			{#each sequences as row}
				<div class="h-12 flex items-center">
					{#each row.sequence as step, stepIndex}
						<div
							class="relative w-full h-full grid place-content-center place-items-center focus-within:z-10"
						>
							{#if (stepIndex % 2) - 1}
								<div class="absolute w-0.5 h-full bg-gray-300 pointer-events-none" />
							{/if}

							<input
								type="checkbox"
								bind:checked={step}
								class="absolute w-full h-full"
								style="background: unset; border: unset;"
							/>

							<div class="absolute w-1 h-1 rounded-full bg-gray-400 pointer-events-none" />

							{#if step}
								<div
									class="absolute w-6 h-6 rounded-full bg-red-500 pointer-events-none z-20"
									transition:scale={{ duration: 400, easing: elasticOut }}
								/>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</section>
</div>
