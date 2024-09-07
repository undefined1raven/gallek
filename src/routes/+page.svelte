<script lang="ts">
	import Box from '../components/common/Box.svelte';
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
	import Label from '../components/common/Label.svelte';
	import Logo from '../components/deco/Logo.svelte';
	import NetworkDeco from '../components/deco/NetworkDeco.svelte';
	import domainGetter from '../fn/domainGetter';
	import { getDownTransition, getTransition } from '../fn/getTransisitions';
	import { passkeySetup } from '../fn/passkeySetup';
	import globalStyle from '../stores/globalStyles';
	let phrase = '';
	let globalStyleActual = {};
	$: validPhrase = phrase.length > 6;
	$: isCheckingPhrase = false;
	$: loadingIndicatorColor = $globalStyle.activeColor;
	$: onIsCheckingPhraseChange(isCheckingPhrase);
	$: hasValidPhrase = false;
	function onIsCheckingPhraseChange(isCheckingPhrase) {
		if (isCheckingPhrase === false) {
			loadingIndicatorColor = $globalStyle.activeColor;
		}
	}

	function setLoadingIndicator(color, timeout) {
		loadingIndicatorColor = color;
		setTimeout(() => {
			isCheckingPhrase = false;
		}, timeout);
	}

	////registration
	let displayName = '';
</script>

<Label verticalFont={'20px'} text="Sign up" figmaImport={{ mobile: { top: 327, left: 32 } }} />
<Box figmaImport={{ mobile: { top: 73, left: 127, width: 175, height: 175 } }}>
	<Logo width="100%" height="100%" />
</Box>
{#if hasValidPhrase === false}
	<Label
		transitions={getTransition(1)}
		verticalFont={'15px'}
		text="Enter phrase"
		figmaImport={{ mobile: { top: 380, left: 32 } }}
	/>
	<Box
		transitions={getTransition(2)}
		figmaImport={{ mobile: { top: 410, left: 32, width: 366, height: 45 } }}
	>
		<Input
			readonly={isCheckingPhrase}
			width="100%"
			height="100%"
			hoverOpacityMax={isCheckingPhrase ? 20 : 30}
			hoverOpacityMin={isCheckingPhrase ? 20 : 10}
			bind:value={phrase}
			verticalFont={'17px'}
			paddingLeft="0.5%"
			borderColor={!isCheckingPhrase ? $globalStyle.activeColor : '#00000000'}
		/>
	</Box>
	{#if isCheckingPhrase}
		<Box figmaImport={{ mobile: { top: 485, left: 32, width: 366, height: 45 } }}>
			<NetworkDeco color={loadingIndicatorColor} height="50%" blinking={true} />
		</Box>
	{:else}
		<Button
			transitions={{ ...getTransition(3) }}
			color={validPhrase ? $globalStyle.activeMono : $globalStyle.inactiveMono}
			backgroundColor={validPhrase ? $globalStyle.activeColor : $globalStyle.inactiveMono}
			borderColor={validPhrase ? $globalStyle.activeColor : $globalStyle.inactiveMono}
			hoverOpacityMin={0}
			onClick={() => {
				isCheckingPhrase = true;
				fetch(domainGetter('/auth/verify'), {
					method: 'post',
					body: JSON.stringify({ phrase }),
					credentials: 'include'
				})
					.then((res) => {
						res.json().then((r) => {
							if (r.success) {
								setLoadingIndicator($globalStyle.successColor, 500);
								hasValidPhrase = true;
							} else {
								setLoadingIndicator($globalStyle.errorColor, 500);
							}
						});
					})
					.catch((e) => {
						setLoadingIndicator($globalStyle.errorColor, 500);
					});
			}}
			verticalFont={'15px'}
			label="Continue"
			figmaImport={{ mobile: { top: 485, left: 32, width: 366, height: 45 } }}
		/>
	{/if}

	<Label
		transitions={getDownTransition(2)}
		verticalFont={'15px'}
		text="Already have an account?"
		figmaImport={{ mobile: { top: 604, left: 32 } }}
	/>
	<Button
		transitions={getDownTransition(1)}
		verticalFont={'15px'}
		label="Sign In"
		figmaImport={{ mobile: { top: 639, left: 32, width: 366, height: 45 } }}
	/>
{:else}
	<Label
		transitions={getTransition(1)}
		verticalFont={'15px'}
		text="Choose a display name"
		figmaImport={{ mobile: { top: 380, left: 32 } }}
	/>
	<Box
		transitions={getTransition(2)}
		figmaImport={{ mobile: { top: 410, left: 32, width: 366, height: 45 } }}
	>
		<Input
			readonly={isCheckingPhrase}
			width="100%"
			placeholder="Display name"
			height="100%"
			hoverOpacityMax={isCheckingPhrase ? 20 : 30}
			hoverOpacityMin={isCheckingPhrase ? 20 : 10}
			bind:value={displayName}
			verticalFont={'17px'}
			paddingLeft="0.5%"
			borderColor={!isCheckingPhrase ? $globalStyle.activeColor : '#00000000'}
		/>
	</Box>
	{#if isCheckingPhrase}
		<Box figmaImport={{ mobile: { top: 485, left: 32, width: 366, height: 45 } }}>
			<NetworkDeco color={loadingIndicatorColor} height="50%" blinking={true} />
		</Box>
	{:else}
		<Button
			transitions={{ ...getTransition(3) }}
			color={validPhrase ? $globalStyle.activeMono : $globalStyle.inactiveMono}
			backgroundColor={validPhrase ? $globalStyle.activeColor : $globalStyle.inactiveMono}
			borderColor={validPhrase ? $globalStyle.activeColor : $globalStyle.inactiveMono}
			hoverOpacityMin={0}
			onClick={() => {
				isCheckingPhrase = true;
				passkeySetup(
					{ displayName, phrase },
					() => {
						setLoadingIndicator($globalStyle.successColor, 500);
					},
					() => {
						setLoadingIndicator($globalStyle.successColor, 500);
					}
				);
			}}
			verticalFont={'15px'}
			label="Continue"
			figmaImport={{ mobile: { top: 485, left: 32, width: 366, height: 45 } }}
		/>
	{/if}
{/if}
