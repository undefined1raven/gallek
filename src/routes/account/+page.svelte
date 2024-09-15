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
	import displayName from '../../stores/displayName';
	import globalStyle from '../../stores/globalStyles';
	import getDateFromUnix from '../../fn/getDateFromUnix';
	let fileInput;
	const client = createClient(
		'https://wrbgbsulbyytggffcavl.supabase.co/', ///safe. its read only on purpose
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYmdic3VsYnl5dGdnZmZjYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3ODc2ODcsImV4cCI6MjA0MTM2MzY4N30.Z8-mJtHO1aS4tm9EScbIkQape1zXa0ycC_dZc86nXfg'
	);

	onMount(() => {
		fetch(domainGetter('/auth/check'), {
			method: 'get',
			credentials: 'include'
		}).then((res) => {
			res.json().then((r) => {
				if (r.authed && r.displayName) {
					localStorage.setItem('name', r.displayName);
					displayName.set(r.displayName);
				} else {
					window.location.href = '/login';
				}
			});
		});
	});

	$: figmaImportConfig = isMobile()
		? { containerHeight: window.screen.height, containerWidth: window.screen.width }
		: { containerHeight: 387, containerWidth: 585 };

	const collection = [
		{ id: '10', path: '', name: '', tx: Date.now() },
		{ id: '111', path: '', name: '', tx: Date.now() },
		{ id: '5434', path: '', name: '', tx: Date.now() },
		{ id: '35', path: '', name: '', tx: Date.now() },
		{ id: '321', path: '', name: '', tx: Date.now() },
		{ id: '23', path: '', name: '', tx: Date.now() },
		{ id: '885', path: '', name: '', tx: Date.now() },
		{ id: '658', path: '', name: '', tx: Date.now() },
		{ id: '234', path: '', name: '', tx: Date.now() },
		{ id: '684', path: '', name: '', tx: Date.now() },
		{ id: '765', path: '', name: '', tx: Date.now() },
		{ id: '65', path: '', name: '', tx: Date.now() },
		{ id: '2332', path: '', name: '', tx: Date.now() },
		{ id: '654', path: '', name: '', tx: Date.now() },
		{ id: '534', path: '', name: '', tx: Date.now() },
		{ id: '4', path: '', name: '', tx: Date.now() },
		{ id: '2', path: '', name: '', tx: Date.now() },
		{ id: '3', path: '', name: '', tx: Date.now() }
	];

	$: selectedItemID = '';
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
<Box figmaImport={{ mobile: { top: 0, left: 0, width: '100%', height: '100%' }, desktop: {} }}>
	<Label
		figmaImport={{ mobile: { top: 18, left: 12 } }}
		verticalFont={'20px'}
		{figmaImportConfig}
		text={'Welcome ' + $displayName}
	/>
	<Button
		verticalFont="12px"
		backdropFilter="blur(10px)"
		hoverOpacityMin={0}
		hoverOpacityMax={20}
		onClick={() => {
			fetch(domainGetter('/auth/logout'), {
				method: 'get',
				credentials: 'include'
			}).then((res) => {
				res.json().then((r) => {
					if (r.success) {
						window.location.href = '/login';
					}
				});
			});
		}}
		figmaImport={{ mobile: { top: 17, width: 87, height: 26, left: 331 } }}
		label="Log Out"
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
		{#each collection as item}
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
						transitions={getTransition(1)}
						className="dontHide"
						hoverOpacityMin={0}
						hoverOpacityMax={20}
						label="Hide"
						verticalFont="12px"
						width="30%"
						left="65%"
						top="10%"
						height="35%"
					/>
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
						top="55%"
						height="35%"
					/>
				{/if}
				<Box
					width="32%"
					left="0%"
					height="100%"
					style="border-right: solid 1px {$globalStyle.activeColor};"
				/>
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
	</Box>
	<Button
		verticalFont="15px"
		backdropFilter="blur(10px)"
		hoverOpacityMin={0}
		hoverOpacityMax={20}
		onClick={() => {}}
		figmaImport={{ mobile: { top: 816, width: 406, height: 45, left: 12 } }}
		label="View Collection"
	/>
	<Button
		verticalFont="15px"
		backdropFilter="blur(10px)"
		hoverOpacityMin={0}
		hoverOpacityMax={20}
		onClick={() => {}}
		figmaImport={{ mobile: { top: 874, width: 406, height: 45, left: 12 } }}
		label="Upload new picture"
	/>
</Box>
