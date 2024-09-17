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
	import AccountMain from './AccountMain.svelte';
	import AccountUpload from './AccountUpload.svelte';
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
				if (r.authed && r.displayName && r.userID) {
					localStorage.setItem('name', r.displayName);
					localStorage.setItem('userID', r.userID);
					displayName.set(r.displayName);
				} else {
					window.location.href = '/login';
				}
			});
		});
	});

	$: currentWindowID = 'main';
	const windowIDToComponent = { main: AccountMain, upload: AccountUpload };
	$: figmaImportConfig = isMobile() ? undefined : { containerHeight: 811, containerWidth: 663 };
</script>

<Box
	figmaImport={{
		mobile: { top: 0, left: 0, width: '100%', height: '100%' },
		desktop: {
			top: 134,
			left: 646,
			width: figmaImportConfig?.containerWidth,
			height: figmaImportConfig?.containerHeight
		}
	}}
>
	<Label
		figmaImport={{ mobile: { top: 18, left: 12 }, desktop: { top: 18, left: 12, width: 'auto' } }}
		verticalFont={'20px'}
		desktopFont="20px"
		style="white-space: nowrap;"
		{figmaImportConfig}
		text={'Welcome ' + $displayName}
	/>
	<Button
		verticalFont="12px"
		backdropFilter="blur(10px)"
		hoverOpacityMin={0}
		desktopFont="13px"
		hoverOpacityMax={20}
		{figmaImportConfig}
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
		figmaImport={{
			mobile: { top: 17, width: 87, height: 26, left: 331 },
			desktop: { top: 19, width: 87, height: 26, left: 560 }
		}}
		label="Log Out"
	/>
	{#if currentWindowID !== 'main'}
		<Button
			transitions="{getTransition(1)}path"
			verticalFont="12px"
			backdropFilter="blur(10px)"
			desktopFont="13px"
			hoverOpacityMin={0}
			{figmaImportConfig}
			hoverOpacityMax={20}
			onClick={() => {
				currentWindowID = 'main';
			}}
			figmaImport={{
				mobile: { top: 17, width: 87, height: 26, left: 238 },
				desktop: { top: 19, width: 87, height: 26, left: 460 }
			}}
			label="Back"
		/>
	{/if}
	<svelte:component
		this={windowIDToComponent[currentWindowID]}
		on:navEvent={(e) => {
			currentWindowID = e.detail;
		}}
	/>
</Box>
