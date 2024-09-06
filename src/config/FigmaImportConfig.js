import isMobile from "../fn/isMobile";

function getFigmaImportConfig() {
    return {
        containerWidth: isMobile() ? 430 : 1920,
        containerHeight: isMobile() ? 932 : 1080
    };
}


export default getFigmaImportConfig;