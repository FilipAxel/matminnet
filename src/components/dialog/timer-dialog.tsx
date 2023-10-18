import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import classNames from "classnames";
import { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

interface TimerDialogProps {
  direction: string;
  isOpen: boolean;
  timeValue: number;
  unit: string;
  onClose: () => void;
}
const minuteSeconds = 60;
const hourSeconds = 3600;

const renderTime = (minutes: number, seconds: number) => {
  const minutesClass = classNames("time", {
    "transition-opacity ease-out duration-400 hidden": minutes === 0,
  });
  const formattedSecounds = Math.ceil(seconds).toString();
  if (minutes === 0 && seconds === 0) {
    return (
      <div className="text-2xl">
        <div>Time&apos;s Up! 🎉</div>
      </div>
    );
  }

  return (
    <div className="text-2xl">
      <div className={minutesClass}>{`${minutes} min`}</div>
      <div>{formattedSecounds} sec</div>
    </div>
  );
};

const TimerDialog: React.FC<TimerDialogProps> = ({
  direction,
  isOpen,
  onClose,
  timeValue,
  unit,
}) => {
  const [isPlayingTimer, setIsPlayingTimer] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [timerKey, setTimerKey] = useState(1);

  const resetTimer = () => {
    setIsPlayingTimer(true);
    setTimerCompleted(false);
    setTimerKey(timerKey + 1);
  };

  const calculateDuration = () => {
    switch (unit) {
      case "sec":
        return timeValue;
      case "min":
        return timeValue * minuteSeconds;
      case "hr":
        return timeValue * hourSeconds;
      default:
        return 0;
    }
  };

  const showNotification = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "denied") {
          console.warn(
            "Notification permission denied. You won't receive notifications."
          );
          console.warn(
            "To reset notification permissions, click the lock icon next to the URL and allow notifications."
          );
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  const playSound = async (url: string) => {
    const audio = new Audio(url);
    await audio.play();
  };

  return (
    <Modal
      backdrop="blur"
      className="m-4"
      placement="center"
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        {(_) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-medium">
              <p>{direction}</p>
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center justify-center">
                <CountdownCircleTimer
                  key={timerKey}
                  isPlaying={isPlayingTimer}
                  size={200}
                  strokeWidth={8}
                  colors="#EF798A"
                  duration={calculateDuration()}
                  onComplete={() => {
                    setIsPlayingTimer(false);
                    setTimerCompleted(true);
                    void playSound("/timer.mp3");
                  }}
                >
                  {({ elapsedTime, color }) => {
                    const remainingTime = calculateDuration() - elapsedTime;
                    const minutes = Math.floor(remainingTime / minuteSeconds);
                    const seconds = remainingTime % minuteSeconds;
                    return (
                      <span style={{ color }}>
                        {renderTime(minutes, seconds)}
                      </span>
                    );
                  }}
                </CountdownCircleTimer>
              </div>
              <div className="flex flex-col gap-2 py-8">
                {!timerCompleted ? (
                  <Button
                    className="text-white"
                    color="success"
                    variant="solid"
                    isDisabled={isPlayingTimer}
                    onPress={() => {
                      setIsPlayingTimer(true);
                      void showNotification();
                    }}
                  >
                    Start Timer
                  </Button>
                ) : (
                  <Button
                    className="text-white"
                    color="success"
                    variant="solid"
                    onPress={resetTimer}
                  >
                    Reset
                  </Button>
                )}
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setIsPlayingTimer(false);
                  }}
                >
                  Pause
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TimerDialog;
