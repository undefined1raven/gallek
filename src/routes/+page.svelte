<script lang="ts">
	import Box from '../components/common/Box.svelte';
	import isMobile from '../fn/isMobile';
	import { getInLeftTransition, getInRightTransition, getTransition } from '../fn/getTransisitions';
	import { getDynamicBorderRadius } from '../fn/dynamicBorders';
	import GallekImageBkg from '../components/deco/GallekPicBkg.svelte';
	import GallekPicBkg from '../components/deco/GallekPicBkg.svelte';
	import collectionCache from '../stores/collectionCache';
	import GallekLogo from '../components/deco/GallekLogo.svelte';
	import GallekLogoMin from '../components/deco/GallekLogoMin.svelte';
	import Button from '../components/common/Button.svelte';
	import Upload from '../components/deco/Upload.svelte';
	import Label from '../components/common/Label.svelte';
	import displayName from '../stores/displayName';
	import DropdownDeco from '../components/deco/DropdownDeco.svelte';
	import globalStyle from '../stores/globalStyles';
	import VerticalLine from '../components/common/VerticalLine.svelte';
	import { scale } from 'svelte/transition';
	import HorizontalLine from '../components/common/HorizontalLine.svelte';
	import getDateFromUnix from '../fn/getDateFromUnix';
	import windowHash from '../stores/windowHash';
	import { onMount } from 'svelte';
	$: pics = shuffleArray($collectionCache);
	$: userIDsToDisplayNames = pics.map((pic) => {
		return { userID: pic.userID, displayName: pic.displayName };
	});
	$: isScrollable1Primary = true;
	$: srcl1Height = 0;
	$: srclHeight = 0;
	onMount(() => {
		const scrl1Height = document.getElementById('scrollable1')?.scrollHeight;
		const scrlHeight = document.getElementById('scrollable')?.scrollHeight;
		if (scrl1Height && scrlHeight) {
			srcl1Height = scrl1Height;
			srclHeight = scrlHeight;
			isScrollable1Primary = scrl1Height >= scrlHeight;
		}
	});

	function onScrolled(scrollTop) {
		const scrl = document.getElementById('scrollable');
		const scrl1 = document.getElementById('scrollable1');

		if (scrl) {
			scrl.scrollTop = scrollTop;
		}
		if (scrl1) {
			scrl1.scrollTop = scrollTop;
		}
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	$: onScrolled(scrollTop);
	$: collectionCacheHalf1 = [];
	$: collectionCacheHalf2 = [];
	$: imgLoaded1 = [];
	$: imgLoaded2 = [];
	$: imgsLoaded = [];
	$: scrollTop = 0;
	$: splitCollectionCache(pics);
	function splitCollectionCache(pics) {
		if (pics) {
			let half = Math.ceil(pics.length / 2);
			collectionCacheHalf1 = pics.slice(0, half);
			for (let ix = 0; ix < collectionCacheHalf1.length; ix++) {
				imgLoaded1[ix] = false;
			}
			collectionCacheHalf2 = pics.slice(half, pics.length);
			for (let ix = 0; ix < collectionCacheHalf1.length; ix++) {
				imgLoaded2[ix] = false;
			}
			for (let ix = 0; ix < pics.length; ix++) {
				imgsLoaded[ix] = false;
			}
		}
	}

	function showFullScreenView(picId) {
		selectedPicID = picId;
		window.location.hash = 'detailedView';
		isShowingFullScreenView = true;
	}
	function nextPic() {
		const idx = pics.findIndex((elm) => elm.id === selectedPicID.id);
		if (idx < pics.length - 1) {
			selectedPicID = pics[idx + 1];
		} else {
			selectedPicID = pics[0];
		}
	}
	function prevPic() {
		const idx = pics.findIndex((elm) => elm.id === selectedPicID.id);
		if (idx > 0) {
			selectedPicID = pics[idx - 1];
		} else {
			selectedPicID = pics[pics.length - 1];
		}
	}
	$: isShowingFullScreenView = false;
	$: selectedPicID = null;
	function scaleIncrement() {
		if (fullScreenViewScale < 7) {
			fullScreenViewScale += 0.5;
		}
	}
	function scaleDecrement() {
		if (fullScreenViewScale > 1) {
			fullScreenViewScale -= 0.5;
		}
	}
	const mobileHoverMin = 40;
	const mobileHoverMax = 60;
	$: fullScreenViewScale = 1; ///min - 1, max - 7
</script>

<Box
	transitions={getTransition(1, 400)}
	style="justify-items: start; align-items: center; display: flex;"
	figmaImport={{
		desktop: { top: 1, left: '0.5%', height: 45, width: '15%' },
		mobile: { top: 1, width: '55%' }
	}}
>
	<GallekLogo width="42%" height="auto" left={'0%'} />
</Box>

<Box
	transitions={getTransition(1, 400)}
	style="justify-items: start; align-items: center; display: flex;"
	figmaImport={{
		desktop: { top: 6, left: '92.5%', height: 35, width: '7%' },
		mobile: { top: 6, width: '20%', left: '78%', height: '3.5%' }
	}}
>
	<Button
		backdropFilter="blur(10px)"
		onClick={() => {
			window.location.href = '/login';
		}}
		width="100%"
		height="100%"
	>
		<Upload width="50%" height="50%" />
	</Button>
</Box>

{#if isMobile()}
	{#if isShowingFullScreenView && $windowHash === '#detailedView'}
		<Box
			style="overflow-y: hidden; border-top-right-radius: 0px; border-top-left-radius: 0px; overflow-x: hidden; z-index: 1000;"
			horizontalCenter={true}
			backdropFilter="blur(60px)"
			backgroundColor="#FFFFFF30"
			figmaImport={{ mobile: { top: 50, left: '50%', width: '100%', height: '95%' } }}
		>
			<Box
				style="overflow-x: scroll; overflow-y: scroll;"
				top="0%"
				height="85%"
				width="100%"
				borderRadius="0px"
				left="0%"
			>
				<img
					style="scale: {fullScreenViewScale};"
					src={selectedPicID.preview}
					width="100%"
					height="auto"
				/>
			</Box>
			<Box width="10%" height="13%" top="86%" left="89%">
				<Button
					style="border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;"
					onClick={() => {
						scaleIncrement();
					}}
					top="0%"
					width="100%"
					height="50%"
					backgroundColor="#FFFFFF"
					label="+"
					borderColor="#000"
					hoverOpacityMin={mobileHoverMin}
					hoverOpacityMax={mobileHoverMax}
					verticalFont="16px"
					color="#000"
				/>
				<HorizontalLine width="100%" color="#00" />
				<Button
					style="border-top-left-radius: 0px; border-top-right-radius: 0px;"
					onClick={() => {
						scaleDecrement();
					}}
					top="50%"
					color="#000"
					width="100%"
					backgroundColor="#FFFFFF"
					height="50%"
					hoverOpacityMin={mobileHoverMin}
					hoverOpacityMax={mobileHoverMax}
					borderColor="#000"
					label="-"
					verticalFont="16px"
				/>
			</Box>
			<Button
				onClick={() => {
					nextPic();
				}}
				width="15%"
				borderColor="#000"
				backdropFilter="blur(20px)"
				backgroundColor="#FFFFFF"
				height="6%"
				top="86%"
				hoverOpacityMin={mobileHoverMin}
				hoverOpacityMax={mobileHoverMax}
				left="70%"
			>
				<DropdownDeco color="#000" style="transform: rotate(180deg);" width="40%" height="50%" />
			</Button>
			<Button
				onClick={() => {
					prevPic();
				}}
				borderColor="#000"
				backgroundColor="#FFFFFF"
				hoverOpacityMin={mobileHoverMin}
				hoverOpacityMax={mobileHoverMax}
				width="15%"
				height="6%"
				top="93%"
				backdropFilter="blur(20px)"
				left="70%"
			>
				<DropdownDeco width="40%" height="50%" color="#000" />
			</Button>
			<Button
				onClick={() => {
					isShowingFullScreenView = false;
				}}
				width="10%"
				height="13%"
				label="Back"
				backdropFilter="blur(150px)"
				verticalFont="12px"
				top="86%"
				hoverOpacityMin={mobileHoverMin}
				hoverOpacityMax={mobileHoverMax}
				backgroundColor="#FFFFFF"
				left="1%"
				color="#000"
				borderColor="#000"
			/>
			<Box width="54%" height="13%" left="13.5%" top="86%" backgroundColor="#FFFFFF00">
				<Label
					text={`Author: ${
						userIDsToDisplayNames.find((elm) => elm.userID === selectedPicID.userID)?.displayName
					}`}
					align="left"
					style="padding-top: 2%; padding-bottom: 2%;"
					top="2%"
					width="100%"
					verticalFont="12px"
					alignPadding="2%"
					color="#000"
					desktopFont="12px"
				/>
			</Box>
			<Box width="54%" height="13%" left="13.5%" top="90%" backgroundColor="#FFFFFF00">
				<Label
					text={`Uploaded: ${getDateFromUnix(selectedPicID.tx)}`}
					align="left"
					top="2%"
					width="100%"
					verticalFont="12px"
					alignPadding="2%"
					style="padding-top: 2%; padding-bottom: 2%;"
					color="#000"
					desktopFont="12px"
				/>
			</Box>
		</Box>
	{/if}
	<Box
		style="overflow-y: scroll; overflow-x: hidden;"
		horizontalCenter={true}
		figmaImport={{ mobile: { top: 50, left: '50%', width: '100%', height: '94.5%' } }}
	>
		<div
			style="
        display: grid;
        left: 0.5%;
        width: 99%;
        top: 0%;
        height: auto;
        position: absolute;
        grid-template-columns: repeat(1, 1fr);
        grid-auto-rows: auto;
        grid-gap: 0.5rem;
"
			class="grid"
		>
			{#each pics === null ? [] : pics as blob, idx}
				<Box
					onClick={() => {
						showFullScreenView(blob);
					}}
					style="position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden;"
					width="100%"
					height="auto"
				>
					{#if blob.preview}
						<img
							on:load={() => {
								const n = imgsLoaded;
								n[idx] = true;
								imgsLoaded = n;
							}}
							src={blob.preview}
							style="width: 100%; height: auto; border-radius: {getDynamicBorderRadius(
								'5px'
							)}; user-select: none;"
							alt="hii"
						/>
						<Label
							top="92%"
							height="8%"
							left="0%"
							backdropFilter="blur(50px)"
							width="auto"
							style="padding-left: 2%; max-height: {0.02 *
								window.innerHeight}px; padding-right: 2%; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
							align="left"
							alignPadding="2%"
							text={`by ${pics[idx]?.displayName}`}
							desktopFont="12px"
							verticalFont="10px"
							horizontalFont="12px"
							color="#AAA"
						/>
						{#if imgsLoaded[idx] === false}
							<Box
								transitions={getTransition(idx)}
								width="100%"
								height="100%"
								backdropFilter="blur(100px)"
							>
								<GallekLogoMin width="20%" height="auto" />
							</Box>
						{/if}
					{/if}
				</Box>
			{/each}
		</div>
	</Box>
{:else}
	<Box
		onscroll={(e) => {
			scrollTop = e.target.scrollTop;
		}}
		id="scrollable1"
		style="overflow-y: scroll; overflow-x: hidden;"
		horizontalCenter={true}
		figmaImport={{ desktop: { top: 50, left: '25%', width: '50%', height: '95%' } }}
	>
		<div
			style="
display: grid;
left: 0.5%;
width: 99.5%;
height: auto;
        top: 0%;
position: absolute;
grid-template-columns: repeat(1, 1fr);
grid-auto-rows: auto;
grid-gap: 0.5rem;
"
			class="grid"
		>
			{#each collectionCacheHalf1 === null ? [] : collectionCacheHalf1 as blob, idx}
				{#if blob.preview}
					<Box
						onClick={() => {
							selectedPicID = blob.id;
							isShowingFullScreenView = true;
						}}
						transitions={getTransition(idx)}
						style="position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
						width="100%"
						height="auto"
					>
						<img
							on:load={() => {
								const n = imgLoaded1;
								n[idx] = true;
								imgLoaded1 = n;
							}}
							src={blob.preview}
							style="width: 100%; height: auto; border-radius: {getDynamicBorderRadius(
								'5px'
							)}; user-select: none;"
							alt="hii"
						/>
						<Label
							top="92%"
							height="8%"
							left="0%"
							backdropFilter="blur(50px)"
							width="auto"
							style="padding-left: 2%; max-height: {0.02 *
								window.innerHeight}px; padding-right: 2%; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
							align="left"
							alignPadding="2%"
							text={`by ${
								userIDsToDisplayNames.find((elm) => elm.userID === blob.userID)?.displayName
							}`}
							desktopFont="12px"
							color="#AAA"
						/>
						{#if imgLoaded1[idx] === false}
							<Box
								transitions={getTransition(idx)}
								width="100%"
								height="100%"
								backdropFilter="blur(100px)"
							>
								<GallekLogoMin width="20%" height="auto" />
							</Box>
						{/if}
					</Box>
				{/if}
			{/each}
		</div>
	</Box>
	<Box
		onscroll={(e) => {
			scrollTop = e.target.scrollTop;
		}}
		id="scrollable"
		style="overflow-y: scroll; overflow-x: hidden;"
		horizontalCenter={true}
		figmaImport={{ desktop: { top: 50, left: '75%', width: '50%', height: '95%' } }}
	>
		<div
			style="
        display: grid;
        left: 0.5%;
        width: 99%;
        top: 0%;
        height: auto;
        position: absolute;
        grid-template-columns: repeat(1, 1fr);
        grid-auto-rows: auto;
        grid-gap: 0.5rem;
    "
			class="grid"
		>
			{#each collectionCacheHalf2 === null ? [] : collectionCacheHalf2 as blob, idx}
				{#if blob.preview}
					<Box
						transitions={getTransition(idx)}
						style="position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden;"
						width="100%"
						height="auto"
					>
						<img
							on:load={() => {
								const n = imgLoaded2;
								n[idx] = true;
								imgLoaded2 = n;
							}}
							src={blob.preview}
							style="width: 100%; height: auto; border-radius: {getDynamicBorderRadius(
								'5px'
							)}; user-select: none;"
							alt="hii"
						/>
						<Label
							top="92%"
							height="8%"
							left="0%"
							backdropFilter="blur(50px)"
							width="auto"
							style="padding-left: 2%; padding-right: 2%; max-height: {0.02 *
								window.innerHeight}px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
							align="left"
							alignPadding="2%"
							text={`by ${
								userIDsToDisplayNames.find((elm) => elm.userID === blob.userID)?.displayName
							}`}
							desktopFont="12px"
							color="#AAA"
						/>
						{#if imgLoaded2[idx] === false}
							<Box
								transitions={getTransition(idx)}
								width="100%"
								height="100%"
								backdropFilter="blur(100px)"
							>
								<GallekLogoMin width="20%" height="auto" />
							</Box>
						{/if}
					</Box>
				{/if}
			{/each}
		</div>
	</Box>
{/if}
