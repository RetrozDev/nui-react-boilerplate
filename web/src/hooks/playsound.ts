const playsound = (soundPath: string,) => {
    const audio = new Audio(soundPath);
    audio.volume = 1.0;
    audio.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
};

export default playsound;