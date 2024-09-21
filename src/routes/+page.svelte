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

	$: pics = shuffleArray($collectionCache);
	$: userIDsToDisplayNames = pics.map((pic) => {
		return { userID: pic.userID, displayName: pic.displayName };
	});
	function onScrolled(scrollTop) {
		const scrl = document.getElementById('scrollable');
		if (scrl) {
			console.log('scrolling', scrollTop);
			scrl.scrollTop = scrollTop;
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
							style="padding-left: 2%; padding-right: 2%; border-top-left-radius: 0px; border-bottom-right-radius: 0px;"
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
		id="scrollable"
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
						transitions={getTransition(idx)}
						style="position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden;"
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
							style="padding-left: 2%; padding-right: 2%; border-top-left-radius: 0px; border-bottom-right-radius: 0px;"
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
							style="padding-left: 2%; padding-right: 2%; border-top-left-radius: 0px; border-bottom-right-radius: 0px;"
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
