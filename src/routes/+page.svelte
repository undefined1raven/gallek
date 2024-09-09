<script lang="ts">
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import Box from '../components/common/Box.svelte';
	import isMobile from '../fn/isMobile';

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
	<Box figmaImport={{ desktop: { top: 110, left: 112, width: 1696, height: 951 } }}>
		<div
			style="display: grid;
			width: 100%;
			height: 100%;
			position: absolute;
				grid-template-columns: repeat(3, 1fr);
				grid-gap: 1rem;
				height: 5vw;"
			class="grid"
		>
			{#each blobs as blob, idx}
				<Box style="position: relative;" width="2vw" backgroundColor="#000000" height="5vw">
					<img src={blob} style="height: 100%; width: auto;" alt="hii" />
				</Box>
			{/each}
		</div>
	</Box>
{/if}
