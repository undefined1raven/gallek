<script>
	import { onMount } from 'svelte';
	import { createClient } from '@supabase/supabase-js';
	import domainGetter from '../fn/domainGetter';
	import collectionCache from '../stores/collectionCache';
	import Box from '../components/common/Box.svelte';
	import GallekLogo from '../components/deco/GallekLogo.svelte';
	import { getTransition } from '../fn/getTransisitions';
	$: hasLoaded = false;
	onMount(() => {
		const client = createClient(
			'https://wrbgbsulbyytggffcavl.supabase.co/', ///safe. its read only on purpose
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYmdic3VsYnl5dGdnZmZjYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3ODc2ODcsImV4cCI6MjA0MTM2MzY4N30.Z8-mJtHO1aS4tm9EScbIkQape1zXa0ycC_dZc86nXfg'
		);
		fetch(domainGetter('/fileOps/getCollection'), { method: 'get' })
			.then((r) => {
				r.json()
					.then((data) => {
						const pics = data.pics;
						let collectionCacheLocal = pics;
						for (let ix = 0; ix < pics.length; ix++) {
							client.storage
								.from('gallek-collection')
								.download(pics[ix].path)
								.then((resx) => {
									if (resx.error === null) {
										const blob = resx.data;
										const reader = new FileReader();
										reader.onloadend = () => {
											const base64Data = reader.result;
											collectionCacheLocal[ix]['preview'] = base64Data;
										};
										reader.readAsDataURL(blob);
									} else {
										// console.log(resx.error);
									}
								})
								.catch((e) => {
									// console.log(e);
								});
						}
						hasLoaded = true;
						collectionCache.set(collectionCacheLocal);
					})
					.catch((e) => {
						// console.log(e);
					});
			})
			.catch((e) => {
				console.log(e);
			});
	});
</script>

<slot />
{#if !hasLoaded && window.location.pathname !== '/login'}
	<Box
		transitions={getTransition(1, 150)}
		style="
background: radial-gradient(94.17% 286.26% at 90.03% 8.24%, #E2E5FF 0%, #AFB3D8 44.28%, #A0A3BA 91.94%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
"
		width="100%"
		height="100%"
		top="0"
		left="0"
	>
		<GallekLogo width="60%" height="20%" />
	</Box>
{/if}
