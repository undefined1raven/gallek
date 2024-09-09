<script lang="ts">
	import { onMount } from 'svelte';
	import Box from '../../components/common/Box.svelte';
	import Button from '../../components/common/Button.svelte';
	import Label from '../../components/common/Label.svelte';
	import { getTransition } from '../../fn/getTransisitions';
	import FileDeco from '../../components/deco/FileDeco.svelte';
	import domainGetter from '../../fn/domainGetter';
	import { createClient } from '@supabase/supabase-js';
	let fileInput;
	const client = createClient(
		'https://wrbgbsulbyytggffcavl.supabase.co/', ///safe. its read only on purpose
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYmdic3VsYnl5dGdnZmZjYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3ODc2ODcsImV4cCI6MjA0MTM2MzY4N30.Z8-mJtHO1aS4tm9EScbIkQape1zXa0ycC_dZc86nXfg'
	);

	onMount(() => {
		setTimeout(() => {
			const reader = new FileReader();
			fileInput.addEventListener('change', (e) => {
				const fileList = e.target.files;
				reader.readAsDataURL(fileList[0]);
				const fileName = fileList[0].name;
				const fileExtension = fileName.split('.').pop();
				reader.addEventListener('load', (ex) => {
					fetch(domainGetter('/fileOps/upload'), {
						method: 'post',
						credentials: 'include',
						body: JSON.stringify({ ext: fileExtension })
					}).then(async (r) => {
						const dataRes = await r.json();
						const data = dataRes.data.data;
						if (dataRes.status === 'success') {
							client.storage
								.from('gallek-collection')
								.uploadToSignedUrl(data.path, data.token, fileList[0])
								.then((r) => {
									console.log(r);
								})
								.catch((e) => {
									console.log(e);
								});
						}
					});
				});
			});
		}, 40);
	});
</script>

<Button
	style="overflow: hidden;"
	hoverOpacityMin={0}
	hoverOpacityMax={20}
	transitions={getTransition(2)}
	alignPadding="15%"
	align="left"
	figmaImport={{ mobile: { top: 102, left: 5, width: 340, height: 59 } }}
	label="Upload a file"
	><FileDeco left="2%" height="40%" />

	<input
		style="width: 100%; height: 100%; opacity: 0.002;"
		bind:this={fileInput}
		class="keyInput"
		type="file"
	/>
</Button>
