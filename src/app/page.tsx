'use client'
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { loadSound } from '@/app/actions'


export default function Home() {
  const audioRef = useRef(null);

  const [text, setText] = useState<string>('');
  const [audioURL, setAudioURL] = useState<string>('');
  const [audioError, setAudioError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Play audio when formState.sound changes
  useEffect(() => {
    if (audioURL && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioURL]);

  const playSound = async () => {
    // Clear error
    setAudioError('');

    if (text.trim() === '') {
      setAudioError('Text input is empty');
      return;
    }
    setIsLoading(true)
    const response = await fetch('/api/sound', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputText: text }),
    });
    if (!response.ok) {
      setIsLoading(false);
      setAudioError('Failed to generate audio. Try again in 10 seconds');
    }

    // Get the audio data as an ArrayBuffer
    const data = await response.arrayBuffer();

    // Convert ArrayBuffer to Blob and create a URL for the audio
    const blob = new Blob([data], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);
    setAudioURL(audioUrl);
    setIsLoading(false);
  }

  const changeTextInput = (text: string) => {
    setText(text);
    // Clear the audio error when the text input changes
    setAudioError('');
    // Clear the audio URL when the text input changes
    setAudioURL('');
    // Clear the audio ref when the text input changes
    if (audioRef.current) {
      audioRef.current.pause();
       audioRef.current.currentTime = 0;
    }
  }

  const downloadSound = async () => {
    if (audioURL) {
      const link = document.createElement('a');
      link.href = audioURL;
      link.download = 'audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]
      bg-slate-100
    ">

      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-5xl text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-sky-600 ">VoiceFlow: </span>Seamless Text-to-Speech Converter</h1>

      <form className="flex flex-col w-1/2 items-center">
        <textarea name="textInput"
        placeholder="Enter your text input"
        className="w-full h-40 p-4 mb-4 resize-none rounded-md bg-slate-200"
        value={text} onChange={e => changeTextInput(e.target.value)}/>
       
        <button type="button" onClick={playSound} className="flex flex-row w-2/3 items-center justify-center relative bg-blue-900 text-white h-16 rounded-md">
          

          {isLoading ?
          <div className="flex flex-row w-[10px]">
            <div className="loader"></div>  
          </div> :
          <span>Play</span>
          }
        </button>

        {audioURL !== "" && audioError === "" &&
        <button type="button" onClick={downloadSound} className="flex flex-row w-2/3 items-center justify-center mt-2 bg-gray-600 text-white h-10 rounded-md">
          <span>Download</span>
          </button>
        }

        <div
          className="text-red-500 mt-2 align-middle text-center"
        >{audioError}</div>
        
        <div className="invisible">
          {audioRef && <audio controls ref={audioRef} src={audioURL}></audio>}
        </div>

      </form>
    </div>
  );
}
