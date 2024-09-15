<script lang="ts">
	import { onMount } from 'svelte';
	import Box from '../../components/common/Box.svelte';
	import Button from '../../components/common/Button.svelte';
	import Label from '../../components/common/Label.svelte';
	import { getTransition } from '../../fn/getTransisitions';
	import FileDeco from '../../components/deco/FileDeco.svelte';
	import domainGetter from '../../fn/domainGetter';
	import { createClient } from '@supabase/supabase-js';
	import displayName from '../../stores/displayName';
	import collectionCache from '../../stores/collectionCache';
	import isMobile from '../../fn/isMobile';
	import globalStyle from '../../stores/globalStyles';
	import { createEventDispatcher } from 'svelte';
	import getDateFromUnix from '../../fn/getDateFromUnix';
	const dispatch = createEventDispatcher();
	$: selectedItemID = '';
	$: ownCollection = $collectionCache.filter(
		(elm) => elm.userID === localStorage.getItem('userID')
	);
	$: figmaImportConfig = isMobile() ? undefined : { containerHeight: 387, containerWidth: 585 };
</script>

<svelte:window
	on:click={(e) => {
		if (e.target.className) {
			if (e.target.className.includes('dontHide')) {
				return;
			}
		}
		selectedItemID = '';
	}}
/>
<Label
	figmaImport={{ mobile: { top: 66, left: 12 } }}
	verticalFont={'15px'}
	{figmaImportConfig}
	text={'Your Collection'}
/>
<Box
	style="overflow-y: scroll; overflow-x: hidden; display: flex; flex-direction: column; align-items: center; justify-content: start; "
	figmaImport={{ mobile: { top: 98, left: 12, width: 406, height: 705 } }}
>
	{#each ownCollection as item}
		<Box
			backgroundColor="#00000000"
			width="100%"
			onSelected={() => {
				selectedItemID = item.id;
			}}
			onClick={(e) => {
				if (e.target.className) {
					if (e.target.className.includes('dontHide')) {
						return;
					}
				}
				selectedItemID = '';
			}}
			height="12%"
			backdropFilter="blur(4px)"
			style="position: relative; min-height: 12%; margin-bottom: 3%;"
		>
			{#if selectedItemID === item.id}
				<Button
					transitions={getTransition(2)}
					className="dontHide"
					label="Delete"
					hoverOpacityMin={0}
					hoverOpacityMax={20}
					color={$globalStyle.errorColor}
					backgroundColor={$globalStyle.errorColor}
					borderColor={$globalStyle.errorColor}
					verticalFont="12px"
					width="30%"
					left="65%"
					top="32.5%"
					height="35%"
				/>
			{/if}
			<Box
				width="32%"
				left="0%"
				height="100%"
				style="border-right: solid 1px {$globalStyle.activeColor}; overflow: hidden;"
			>
				<img
					style="user-select: none;"
					width="100%"
					height="auto"
					src={item.preview}
					alt={item.name}
				/>
			</Box>
			<Label
				align="left"
				text="Uploaded on:"
				top="30%"
				verticalFont="12px"
				height="10%"
				width="30%"
			/>
			<Label
				text={getDateFromUnix(item.tx)}
				top="60%"
				align="left"
				verticalFont="12px"
				height="10%"
				width="30%"
			/>
		</Box>
	{/each}
	{#if ownCollection.length === 0}
		<Label
			transitions={getTransition(2)}
			text="Upload a pic to get started"
			width="80%"
			verticalFont="12px"
			height="7%"
			top="2%"
			backgroundColor="{$globalStyle.activeColor}20"
		/>
	{/if}
</Box>
<Button
	verticalFont="15px"
	backdropFilter="blur(10px)"
	hoverOpacityMin={0}
	hoverOpacityMax={20}
	onClick={() => {
		window.location.href = '/';
	}}
	figmaImport={{ mobile: { top: 816, width: 406, height: 45, left: 12 } }}
	label="View Collection"
/>
<Button
	verticalFont="15px"
	backdropFilter="blur(10px)"
	hoverOpacityMin={0}
	hoverOpacityMax={20}
	onClick={() => {
		dispatch('navEvent', 'upload');
	}}
	figmaImport={{ mobile: { top: 874, width: 406, height: 45, left: 12 } }}
	label="Upload new picture"
/>
