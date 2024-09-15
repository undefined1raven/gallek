<script lang="ts">
	import { startRegistration } from '@simplewebauthn/browser';
	import Box from '../../components/common/Box.svelte';
	import Button from '../../components/common/Button.svelte';
	import Input from '../../components/common/Input.svelte';
	import Label from '../../components/common/Label.svelte';
	import Logo from '../../components/deco/Logo.svelte';
	import NetworkDeco from '../../components/deco/NetworkDeco.svelte';
	import domainGetter from '../../fn/domainGetter';
	import { getDownTransition, getTransition } from '../../fn/getTransisitions';
	import { passkeyAuth, passkeySetup } from '../../fn/passkeySetup';
	import globalStyle from '../../stores/globalStyles';
	import isLoggedIn from '../../stores/auth';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import KeyDeco from '../../components/deco/KeyDeco.svelte';
	import GallekLogo from '../../components/deco/GallekLogo.svelte';
	import isMobile from '../../fn/isMobile';
	const dispatch = createEventDispatcher();
	let displayName = '';
	let globalStyleActual = {};
	$: validPhrase = displayName.length > 1 && displayName.length <= 20;
	$: isCheckingPhrase = false;
	$: loadingIndicatorColor = $globalStyle.activeColor;
	$: onIsCheckingPhraseChange(isCheckingPhrase);
	$: hasValidPhrase = false;
	function onIsCheckingPhraseChange(isCheckingPhrase) {
		if (isCheckingPhrase === false) {
			loadingIndicatorColor = $globalStyle.activeColor;
		}
	}

	function setLoadingIndicator(color, timeout, redirect = '') {
		loadingIndicatorColor = color;
		setTimeout(() => {
			isCheckingPhrase = false;
			if (redirect !== '') {
				window.location.href = redirect;
			}
		}, timeout);
	}

	$: keyLabel = 'Waiting for key authentication';
	$: keyColor = $globalStyle.activeColor;
	function setKeyIndicator(
		color,
		timeout,
		redirect = '',
		label = 'Waiting for key authentication'
	) {
		isCheckingPhrase = true;
		keyLabel = label;
		keyColor = color;
		if (timeout === false) return;
		setTimeout(() => {
			isCheckingKey = false;
			isCheckingPhrase = false;
			if (redirect !== '') {
				window.location.href = redirect;
			}
		}, timeout);
	}

	$: isCheckingKey = false;

	$: figmaImportConfig = isMobile() ? undefined : { containerHeight: 387, containerWidth: 585 };
</script>

<Label
	verticalFont={'16px'}
	{figmaImportConfig}
	desktopFont={'21px'}
	text="Log in"
	figmaImport={{ mobile: { top: 327, left: 32 }, desktop: { left: 22, top: 110 } }}
/>
<Box
	{figmaImportConfig}
	figmaImport={{
		mobile: { top: 73, left: 127, width: 175, height: 175 },
		desktop: { width: 119, height: 50, top: 27, left: 22 }
	}}
>
	<GallekLogo width="100%" />
</Box>
<Label
	{figmaImportConfig}
	transitions={getTransition(1)}
	verticalFont={'12px'}
	desktopFont={'15px'}
	text="Display name"
	figmaImport={{ mobile: { top: 380, left: 32 }, desktop: { left: 22, top: 161 } }}
/>
<Box
	{figmaImportConfig}
	transitions={getTransition(2)}
	backdropFilter="blur(10px)"
	figmaImport={{
		mobile: { top: 410, left: 32, width: 366, height: 45 },
		desktop: { top: 190, left: 22, width: 377, height: 45 }
	}}
>
	<Input
		readonly={isCheckingPhrase}
		width="99%"
		height="100%"
		desktopFont={'15px'}
		hoverOpacityMax={isCheckingPhrase ? 20 : 30}
		hoverOpacityMin={isCheckingPhrase ? 20 : 10}
		bind:value={displayName}
		verticalFont={'15px'}
		paddingLeft="1%"
		borderColor={!isCheckingPhrase ? $globalStyle.activeColor : '#00000000'}
	/>
</Box>
{#if isCheckingPhrase}
	{#if isCheckingKey}
		<Label
			{figmaImportConfig}
			transitions={{ ...getTransition(1) }}
			color={keyColor}
			backgroundColor={keyColor + '20'}
			verticalFont={'12px'}
			align="left"
			backdropFilter="blur(10px)"
			alignPadding="15%"
			text={keyLabel}
			desktopFont={'15px'}
			figmaImport={{
				mobile: { top: 485, left: 32, width: 302, height: 45 },
				desktop: { width: 377, height: 45, top: 261, left: 22 }
			}}
		>
			<KeyDeco color={keyColor} height="25%" left="2%" /></Label
		>
	{:else}
		<Box
			{figmaImportConfig}
			figmaImport={{
				mobile: { top: 485, left: 32, width: 366, height: 45 },
				desktop: { width: 377, height: 45, top: 261, left: 22 }
			}}
		>
			<NetworkDeco color={loadingIndicatorColor} height="50%" blinking={true} />
		</Box>
	{/if}
{:else}
	<Button
		{figmaImportConfig}
		opacity={validPhrase ? 1 : 0}
		transitions={{ ...getTransition(3) }}
		backdropFilter="blur(10px)"
		color={$globalStyle.activeMono}
		backgroundColor={$globalStyle.activeColor}
		borderColor={$globalStyle.activeColor}
		hoverOpacityMin={0}
		onClick={() => {
			isCheckingPhrase = true;
			passkeyAuth(
				{ displayName },
				() => {
					setLoadingIndicator($globalStyle.errorColor, 500);
				},
				() => {
					setLoadingIndicator($globalStyle.successColor, 500);
				},
				() => {
					isCheckingKey = true;
					setKeyIndicator($globalStyle.activeColor, false);
				},
				() => {
					isCheckingKey = true;
					setKeyIndicator($globalStyle.errorColor, 500, '', 'Key not found');
				},
				() => {
					isCheckingKey = true;
					setKeyIndicator($globalStyle.successColor, 700, '/account', 'Key authenticated');
				}
			);
		}}
		verticalFont={'12px'}
		desktopFont={'15px'}
		label="Use key"
		figmaImport={{
			mobile: { top: 485, left: 32, width: 366, height: 45 },
			desktop: { width: 377, height: 45, top: 261, left: 22 }
		}}
	/>
{/if}

<Label
	{figmaImportConfig}
	transitions={getDownTransition(2)}
	verticalFont={'12px'}
	desktopFont={'13px'}
	text="Have a secret phrase?"
	figmaImport={{ mobile: { top: 604, left: 32 }, desktop: { top: 337, left: 22 } }}
/>
<Button
	{figmaImportConfig}
	onClick={() => {
		dispatch('changePage', 'signup');
	}}
	transitions={getDownTransition(1)}
	verticalFont={'12px'}
	label="Sign Up"
	desktopFont={'13px'}
	backdropFilter="blur(10px)"
	figmaImport={{
		mobile: { top: 639, left: 32, width: 366, height: 45 },
		desktop: { left: 260, top: 328, width: 139, height: 30 }
	}}
/>
