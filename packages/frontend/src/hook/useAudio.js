import { useEffect, useState } from "react";

const useAudio = (url) => {
  const initAudio = new Audio(url);
  //Adjust the volume of the audio.
  initAudio.volume = 0.2;
  const [audio] = useState(initAudio);
  const [playing, setPlaying] = useState(false);
  const doNothing = () => {};
  const stop = () => {
    setPlaying(false);
    audio.pause();
  };
  //Set the audio player to playing if the playing state is false.
  const toggle = () => {
    if (!playing) {
      setPlaying(true);
    } else {
      //If the audio is not connected, then set the playing to false.
      if (!audio.isConnected) {
        setPlaying(false);
      }
    }
  };

  //If the playing is true, then play the audio.
  useEffect(() => {
    playing ? audio.play() : doNothing();
  }, [playing]);

  //If the music playing is completed, then set the playing back to false.
  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return { playing, toggle, stop };
};

export default useAudio;
