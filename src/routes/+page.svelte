<script lang="ts">
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import Box from '../components/common/Box.svelte';
	import isMobile from '../fn/isMobile';
	import { getInRightTransition } from '../fn/getTransisitions';
	import { getDynamicBorderRadius } from '../fn/dynamicBorders';
	import GallekImageBkg from '../components/deco/GallekPicBkg.svelte';
	import GallekPicBkg from '../components/deco/GallekPicBkg.svelte';
	$: blobs = [];
	onMount(() => {
		const client = createClient(
			'https://wrbgbsulbyytggffcavl.supabase.co/', ///safe. its read only on purpose
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYmdic3VsYnl5dGdnZmZjYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3ODc2ODcsImV4cCI6MjA0MTM2MzY4N30.Z8-mJtHO1aS4tm9EScbIkQape1zXa0ycC_dZc86nXfg'
		);
		client.storage
			.from('gallek-collection')
			.list()
			.then((r) => {
				for (let ix = 0; ix < r.data.length; ix++) {
					client.storage
						.from('gallek-collection')
						.download(r.data[ix].name)
						.then((res) => {
							const blob = res.data;
							const reader = new FileReader();
							reader.onloadend = () => {
								const base64Data = reader.result;
								blobs = [...blobs, base64Data];
							};
							reader.readAsDataURL(blob);
						})
						.catch((e) => {
							console.log(e);
						});
				}
			})
			.catch((e) => {
				console.log(e);
			});
	});
</script>

{#if isMobile()}
	{#each blobs as blob, idx}
		<Box width="15vh" backgroundColor="#000" height="15vh" left={5 * idx + '%'}>
			<img src={blob} style="height: 100%; width: 100%" alt="hii" />
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
			{#each blobs as blob, idx}
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
						<img
							id={'d' + idx}
							src={blob}
							style="object-fit: fit; border-radius: {getDynamicBorderRadius(5)}"
							alt="hii"
						/>
					</Box>
				</Box>
			{/each}
		</div>
	</Box>
{/if}
