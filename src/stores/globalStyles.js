import { writable } from "svelte/store";

let globalStyle = writable({
    activeColor: '#192058',//0038FF
    activeLightColor: '#2958FF',
    secondaryColor: '#363A5F',
    inactiveColor: '#353535',
    activeMono: '#192058',
    secondaryMono: '#363A5F',
    inactiveMono: '#353535',
    errorColor: '#A90000',
    successColor: '#006410',
    borderRadius: '3px',
    borderRadius20: '20px',
    borderRadius10: '10px',
    largeDesktopFont: '27px',
    veryLargeDesktopFont: '31px',
    verySmallDesktopFont: '15px',
    titleDesktopFont: '60px',
    regularDesktopFont: '25px',
    smallDesktopFont: '17px',
    mediumDesktopFont: '21px',
    footnoteDesktopFont: '12px',
    veryLargeMobileFont: '31px',
    largeMobileFont: '19px',
    regularMobileFont: '16px',
    mediumMobileFont: '14px',
    smallMobileFont: '10px',
    footnoteMobileFont: '8px',
    theme: 'light',
});


export default globalStyle;