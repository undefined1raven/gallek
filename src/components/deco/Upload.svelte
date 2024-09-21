<script>
	import globalStyle from '../../stores/globalStyles';
	let lglobalStyles = $globalStyle;
	globalStyle.subscribe((gs) => {
		lglobalStyles = gs;
	});
	let height = '5vh';
	let width = '5vh';
	let left = 'auto';
	let top = 'auto';
	let style = '';
	let color = lglobalStyles.activeColor;

	export { height, width, left, top, style, color };
</script>

<svg
	{width}
	{height}
	style="position: absolute; top: {top}; left: {left}; {style}"
	viewBox="0 0 28 23"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect y="21" width="28" height="2" rx="1" fill={color} />
	<rect x="13" y="1" width="2" height="19" rx="1" fill={color} />
	<path
		d="M8.34309 8.00285C7.95257 8.39338 7.3194 8.39338 6.92888 8.00285V8.00285C6.53836 7.61233 6.53836 6.97916 6.92888 6.58864L12.5857 0.931787C12.9763 0.541262 13.6094 0.541262 13.9999 0.931786V0.931786C14.3905 1.32231 14.3905 1.95548 13.9999 2.346L8.34309 8.00285Z"
		fill={color}
	/>
	<path
		d="M21.0711 6.58855C21.4616 6.97907 21.4616 7.61224 21.0711 8.00276V8.00276C20.6806 8.39329 20.0474 8.39329 19.6569 8.00276L14 2.34591C13.6095 1.95538 13.6095 1.32222 14 0.931693V0.931693C14.3905 0.541169 15.0237 0.541169 15.4142 0.931693L21.0711 6.58855Z"
		fill={color}
	/>
</svg>
