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
</script>

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
