<script lang="ts">
	import Box from '../components/common/Box.svelte';
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
	import Label from '../components/common/Label.svelte';
	import Logo from '../components/deco/Logo.svelte';
	import globalStyle from '../stores/globalStyles';

	let globalStyleActual = {};
	globalStyle.subscribe((value) => (globalStyleActual = value));
</script>

<Label verticalFont={'20px'} text="Sign up" figmaImport={{ mobile: { top: 327, left: 32 } }} />
<Label verticalFont={'15px'} text="Enter phrase" figmaImport={{ mobile: { top: 380, left: 32 } }} />
<Input
	verticalFont={'17px'}
	paddingLeft="0.5%"
	figmaImport={{ mobile: { top: 410, left: 32, width: 366, height: 45 } }}
	borderColor={globalStyleActual.activeColor}
/>
<Button
	verticalFont={'17px'}
	label="Continue"
	figmaImport={{ mobile: { top: 485, left: 32, width: 366, height: 45 } }}
/>
<Box figmaImport={{ mobile: { top: 73, left: 127, width: 175, height: 175 } }}>
	<Logo width="100%" height="100%" />
</Box>
<Label
	verticalFont={'15px'}
	text="Already have an account?"
	figmaImport={{ mobile: { top: 604, left: 32 } }}
/>
<Button
	verticalFont={'17px'}
	label="Sign In"
	figmaImport={{ mobile: { top: 639, left: 32, width: 366, height: 45 } }}
/>
