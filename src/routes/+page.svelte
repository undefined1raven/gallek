<script lang="ts">
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import Box from '../components/common/Box.svelte';
	import isMobile from '../fn/isMobile';
	import { getInRightTransition } from '../fn/getTransisitions';
	import { getDynamicBorderRadius } from '../fn/dynamicBorders';
	import GallekImageBkg from '../components/deco/GallekPicBkg.svelte';
	import GallekPicBkg from '../components/deco/GallekPicBkg.svelte';
	import collectionCache from '../stores/collectionCache';

	let pics = $collectionCache;
	$: flicr = true;
	collectionCache.subscribe((value) => {
		pics = value;
		flicr = false;
		setTimeout(() => {
			flicr = true;
		}, 500);
	});
</script>

{#if isMobile()}
	{#each $collectionCache === null ? [] : $collectionCache as blob, idx}
		<Box width="15vh" backgroundColor="#00000000" height="15vh" left={5 * idx + '%'}>
			{#if flicr}
				<img src={blob.preview} style="height: 100%; width: 100%" alt="hii" />
			{/if}
		</Box>
	{/each}
{:else}
	<Box
		style="overflow-y: scroll; overflow-x: hidden;"
		horizontalCenter={true}
		figmaImport={{ desktop: { top: 110, left: '50%', width: 1200, height: 951 } }}
	>
		<div
			style="display: grid;
			width: 100%;
			height: 100%;
			position: absolute;
			grid-template-columns: repeat(4, 1fr);
			grid-auto-flow: row;
			grid-gap: 0.5rem;
			height: 100%;"
			class="grid"
		>
			{#each $collectionCache === null ? [] : $collectionCache as blob, idx}
				<Box
					style="position: relative; display: flex; justify-content: center; align-items: center;"
					width="100%"
					height="15vw"
				>
					<Box
						mouseEnter={() => {
							const el = document.getElementById('d' + idx);
							if (el) {
								el.style.transform = 'scale(0.5)';
								el.style.transition = 'transform  ease-in-out 0.2s';
							}
						}}
						mouseLeave={() => {
							const el = document.getElementById('d' + idx);
							if (el) {
								el.style.transform = 'scale(1)';
								el.style.transition = 'transform  ease-in-out 0.2s';
							}
						}}
						height="15vw"
						width="15vw"
						style="overflow: hidden;"
					>
						{#if flicr}
							<img
								id={'d' + idx}
								src={blob.preview}
								style="object-fit: fit; border-radius: {getDynamicBorderRadius(
									5
								)}; user-select: none;"
								alt="hii"
							/>
						{/if}
					</Box>
				</Box>
			{/each}
		</div>
	</Box>
{/if}
