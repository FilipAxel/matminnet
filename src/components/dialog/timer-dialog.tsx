import { Button } from "@nextui-org/react";
import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FaPause, FaPlay, FaStop } from "react-icons/fa6";

export const playSound = async (url: string): Promise<void> => {
  const audio = new Audio(url);
  await audio.play();
};

interface TimerDialogProps {
  timeValue: number;
  unit: string;
}

export const showNotification = async (): Promise<void> => {
  if ("Notification" in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        console.warn(
          "Aviseringsbehörighet nekad. Du kommer inte att få aviseringar."
        );
        console.warn(
          "För att återställa aviseringstillståndet, klicka på låsikonen bredvid webbadressen och tillåt aviseringar"
        );
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }
};

export const calculateDurationInSeconds = (unit: string, timeValue: number) => {
  switch (unit) {
    case "sec":
      return Math.floor(timeValue);
    case "min":
      return Math.floor(timeValue * 60); // Convert minutes to seconds
    case "hr":
      return Math.floor(timeValue * 3600); // Convert hours to seconds
    default:
      return 0;
  }
};

const TimerDialog: React.FC<TimerDialogProps> = ({ timeValue, unit }) => {
  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(1);
  const [minutes, setMinutes] = useState(
    Math.floor((calculateDurationInSeconds(unit, timeValue) % 3600) / 60)
  );
  const [seconds, setseconds] = useState(
    calculateDurationInSeconds(unit, timeValue) % 60
  );

  const handleStart = () => {
    setStart(true);
  };

  const handleStop = () => {
    setStart(false);
  };

  const handleReset = () => {
    setStart(false);
    setReset(reset + 1);
  };

  return (
    <div className="mt-3 flex flex-col items-center justify-center rounded-large bg-gray-700 p-3">
      <CountdownCircleTimer
        isPlaying={start}
        duration={calculateDurationInSeconds(unit, timeValue)}
        size={160}
        strokeWidth={8}
        colors={"#f5a524"}
        key={reset}
        onComplete={() => {
          void playSound("/timer.mp3");
          setStart(false);
        }}
        initialRemainingTime={calculateDurationInSeconds(unit, timeValue)}
      >
        {({ remainingTime }) => {
          setMinutes(Math.floor((remainingTime % 3600) / 60));
          setseconds(remainingTime % 60);

          return (
            <>
              <h1
                role="timer"
                aria-live="assertive"
                className="text-center text-3xl font-normal text-white"
              >
                {minutes ? `${minutes < 10 ? `0${minutes}` : minutes}:` : "00:"}
                {`${seconds < 10 ? `0${seconds}` : seconds}`}
              </h1>
            </>
          );
        }}
      </CountdownCircleTimer>
      <div className="flex gap-32">
        <Button
          className="h-12 w-12 bg-[#ff0000]"
          variant="solid"
          radius="full"
          isIconOnly
          onClick={handleReset}
        >
          <FaStop className="text-white" />
        </Button>
        <Button
          className={`h-12 w-12 ${start ? "bg-[#f5a524]" : " bg-success-400"}`}
          variant="solid"
          radius="full"
          isIconOnly
          onClick={() => {
            if (start) {
              handleStop();
            } else {
              if (seconds <= 0 && minutes <= 0) {
                handleReset();
              }
              handleStart();
              void showNotification();
            }
          }}
        >
          {start ? (
            <FaPause className="text-white" />
          ) : (
            <FaPlay className="text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TimerDialog;
