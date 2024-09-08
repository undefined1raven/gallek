<script lang="ts">
	import { onMount } from 'svelte';
	import Box from '../../components/common/Box.svelte';
	import Button from '../../components/common/Button.svelte';
	import Label from '../../components/common/Label.svelte';
	import { getTransition } from '../../fn/getTransisitions';
	import FileDeco from '../../components/deco/FileDeco.svelte';
	import domainGetter from '../../fn/domainGetter';
	let fileInput;
	onMount(() => {
		setTimeout(() => {
			const reader = new FileReader();
			fileInput.addEventListener('change', (e) => {
				const fileList = e.target.files;
				reader.readAsDataURL(fileList[0]);
				reader.addEventListener('load', (ex) => {
					const data = ex.target.result;
					fetch(domainGetter('/fileOps/upload'), {
						method: 'post',
						credentials: 'include',
						body: JSON.stringify({ data })
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
