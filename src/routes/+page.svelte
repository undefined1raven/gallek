<script lang="ts">
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import Box from '../components/common/Box.svelte';

	$: blobs = [];
	onMount(() => {
		const client = createClient(
			'https://wrbgbsulbyytggffcavl.supabase.co/',///safe. its read only on purpose
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
							if (res.data === undefined) return;
                            const blob = res.data;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64String = reader.result.split(',')[1];
                                const blobWithType = new Blob([base64String], { type: 'image/png' });
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

{#each blobs as blob}
	<Box width="50vh" backgroundColor="#000" height="50vh">
		<img src={blob} style="height: 100%; width: 100%" alt="hii"/>
	</Box>
{/each}
