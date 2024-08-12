
const convertCmToFeetAndInches = (cm: number) => {
    if (!cm) return { feet: "", inches: "", string: "N/A" };
    const num = cm / 2.54;
    const feet = Math.floor(num / 12);
    const inches = Math.round(num % 12);
    return {
        feet,
        inches,
        string: `${feet} ft ${inches} in`
    };
};

const convertFeetAndInchesToCm = (feet: number, inches: number) => {
    return (feet * 30.48 + inches * 2.54) || null
}

function generateYoutubeEmbedUrl(url: string) {
    const regex = /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    const videoId = match ? match[1] : null;
    return `https://www.youtube.com/embed/${videoId}`;
}

export {
    convertCmToFeetAndInches,
    convertFeetAndInchesToCm,
    generateYoutubeEmbedUrl
}