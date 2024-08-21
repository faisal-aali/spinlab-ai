
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

const convertDoBToAge = (dob: string) => {
    if (!dob) return ''
    // Convert the input string to a Date object
    const birthDate = new Date(dob);
    const today = new Date();

    // Calculate the difference in years
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust the age if the birthday hasn't occurred yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function generateYoutubeEmbedUrl(url: string) {
    const regex = /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    const videoId = match ? match[1] : null;
    return `https://www.youtube.com/embed/${videoId}`;
}

function convertVimeoUrlToEmbed(url: string) {
    const path = url.split('?')[0];
    const arr = path.split('/')
    const hash = arr[4];
    const id = arr[3];
    return `https://player.vimeo.com/video/${id || hash}?h=${hash}`
}

export {
    convertCmToFeetAndInches,
    convertFeetAndInchesToCm,
    generateYoutubeEmbedUrl,
    convertDoBToAge,
    convertVimeoUrlToEmbed
}