<script lang="ts">
	import { onMount } from 'svelte';
	import Box from '../../components/common/Box.svelte';
	import Button from '../../components/common/Button.svelte';
	import Label from '../../components/common/Label.svelte';
	import { getTransition } from '../../fn/getTransisitions';
	import FileDeco from '../../components/deco/FileDeco.svelte';
	import domainGetter from '../../fn/domainGetter';
	import { createClient } from '@supabase/supabase-js';
	import isMobile from '../../fn/isMobile';
	import globalStyle from '../../stores/globalStyles';
	import { getDynamicBorderRadius } from '../../fn/dynamicBorders';
	import Input from '../../components/common/Input.svelte';
	import Textarea from '../../components/common/Textarea.svelte';
	import GallekLogoMin from '../../components/deco/GallekLogoMin.svelte';
	import collectionCache from '../../stores/collectionCache';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let fileInput;
	$: preview = '';
	$: fileExtension = null;
	$: file = null;
	$: name = '';
	$: description = '';
	const client = createClient(
		'https://wrbgbsulbyytggffcavl.supabase.co/', ///safe. its read only on purpose
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYmdic3VsYnl5dGdnZmZjYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3ODc2ODcsImV4cCI6MjA0MTM2MzY4N30.Z8-mJtHO1aS4tm9EScbIkQape1zXa0ycC_dZc86nXfg'
	);
	function upload() {
		fetch(domainGetter('/fileOps/upload'), {
			method: 'post',
			credentials: 'include',
			body: JSON.stringify({ ext: fileExtension, name, description })
		}).then(async (r) => {
			const dataRes = await r.json();
			const newPic = dataRes.newPic;
			newPic['preview'] = preview;
			collectionCache.update((old) => [...old, newPic]);
			const data = dataRes.data.data;
			dispatch('navEvent', 'main');
			if (dataRes.status === 'success') {
				client.storage
					.from('gallek-collection')
					.uploadToSignedUrl(data.path, data.token, file)
					.then((r) => {
						if (!r.error) {
							console.log('uploaded');
						}
					})
					.catch((e) => {
						console.log(e);
					});
			}
		});
	}

	setTimeout(() => {
		const reader = new FileReader();
		fileInput.addEventListener('change', (e) => {
			const fileList = e.target.files;
			reader.readAsDataURL(fileList[0]);
			const fileName = fileList[0].name;
			fileExtension = fileName.split('.').pop();
			reader.addEventListener('load', (ex) => {
				preview = ex.target.result;
				file = fileList[0];
			});
		});
	}, 40);

	function maxChars(maxLen) {
		if (name.length > maxLen) {
			name = name.slice(0, maxLen);
		}
	}

	function maxChars2(maxLen) {
		if (description.length > maxLen) {
			description = description.slice(0, maxLen);
		}
	}
	$: maxChars(150, name);
	$: maxChars2(1500, description);
	const relOffset = '-3%';
	$: figmaImportConfig = isMobile()
		? { containerHeight: window.screen.height, containerWidth: window.screen.width }
		: { containerHeight: 387, containerWidth: 585 };
</script>

<Box
	style="overflow-x: hidden; overflow-y: scroll; display: flex; flex-direction: column; align-items: center; justify-content: start; "
	figmaImport={{ mobile: { top: 66, left: 12, width: 406, height: 790 } }}
>
	<Label
		width="100%"
		align="left"
		style="position: relative; margin-bottom: 3%; min-height: 3%;"
		verticalFont={'15px'}
		{figmaImportConfig}
		text={'Your Collection'}
	/>

	<Button
		{figmaImportConfig}
		style="overflow: hidden; position: relative; white-space: nowrap; min-height: 7%;"
		hoverOpacityMin={0}
		top="0%"
		height="7%"
		width="85%"
		hoverOpacityMax={20}
		transitions={getTransition(1)}
		alignPadding="15%"
		align="left"
		label="Upload a file"
	>
		<FileDeco left="2%" height="40%" />
	</Button>
	<input
		style="min-height: 7%; background-color: #000; position: relative; top: -9%; width: 100%; height: 7%; opacity: 0.002;"
		bind:this={fileInput}
		class="keyInput"
		type="file"
	/>
	<Label
		width="100%"
		align="left"
		top={relOffset}
		style="position: relative; margin-bottom: 3%; min-height: 3%;"
		verticalFont={'15px'}
		{figmaImportConfig}
		text={'Preview'}
	/>
	<Box
		style="min-height: {preview === ''
			? '50%'
			: 'auto'}; position: relative; top: {relOffset}; overflow: hidden; margin-bottom: 6%;"
		height={preview === '' ? '55%' : 'auto'}
		width="99%"
		borderColor={$globalStyle.activeColor}
	>
		{#if preview === ''}
			<GallekLogoMin width="100%" height="50%" style="opacity: 0.15;" />
		{/if}
		<img
			style="border-radius: {getDynamicBorderRadius('5px')};"
			width="100%"
			height="auto"
			src={preview}
			alt=""
		/></Box
	>
	<Label
		width="100%"
		align="left"
		top={relOffset}
		style=" position: relative; margin-bottom: 3%; min-height: 3%;"
		verticalFont={'15px'}
		{figmaImportConfig}
		text={'Details (options)'}
	/>
	<Label
		width="100%"
		align="left"
		top={relOffset}
		style=" position: relative; margin-bottom: 2%; min-height: 3%;"
		verticalFont={'13px'}
		{figmaImportConfig}
		text={'Name'}
	/>
	<Input
		width="98%"
		height="7%"
		bind:value={name}
		verticalFont={'13px'}
		borderColor={$globalStyle.activeColor}
		style="top: {relOffset}; min-height: 6%; position: relative; margin-bottom: 3%; padding-left: 2%; text-aling: left;"
	/>
	<Label
		width="100%"
		align="left"
		top={relOffset}
		style=" position: relative; margin-bottom: 2%; min-height: 3%;"
		verticalFont={'13px'}
		{figmaImportConfig}
		text={'Description'}
	/>
	<Textarea
		width="98%"
		bind:value={description}
		height="15%"
		verticalFont={'13px'}
		borderColor={$globalStyle.activeColor}
		style="top: {relOffset}; position: relative; min-height: 15%; padding-top: 2%; margin-bottom: 3%; padding-left: 2%; text-aling: left;"
	/>
</Box>
<Button
	hoverOpacityMax={file && fileExtension ? 20 : 0}
	hoverOpacityMin={0}
	color={file && fileExtension ? $globalStyle.activeColor : $globalStyle.inactiveColor}
	borderColor={file && fileExtension ? $globalStyle.activeColor : $globalStyle.inactiveColor}
	backgroundColor={file && fileExtension ? $globalStyle.activeColor : $globalStyle.inactiveColor}
	label="Upload new pic"
	verticalFont="15px"
	figmaImport={{ mobile: { top: 874, left: 12, width: 408, height: 45 } }}
	onClick={() => {
		if (file === null || fileExtension === null) return;
		upload();
	}}
/>
