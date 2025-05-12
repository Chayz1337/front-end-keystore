// src/components/ui/CountdownTimer.tsx
'use client';

import React, { useState, useEffect, FC } from 'react';
import { FiAlertTriangle, FiClock } from 'react-icons/fi';

interface CountdownTimerProps {
  expiryTimestamp: string; // ISO строка или что-то, что new Date() может распарсить
  onExpiry?: () => void;   // Функция, вызываемая при истечении времени
  className?: string;
  expiredText?: string;
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const CountdownTimer: FC<CountdownTimerProps> = ({
  expiryTimestamp,
  onExpiry,
  className,
  expiredText = "Время вышло"
}) => {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(expiryTimestamp) - +new Date();
    let timeLeft: TimeLeft | null = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = null; // Время вышло
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
  const [isExpired, setIsExpired] = useState(+new Date(expiryTimestamp) - +new Date() <= 0);

  useEffect(() => {
    if (isExpired) {
      if (onExpiry) {
        onExpiry();
      }
      return;
    }

    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (!newTimeLeft) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }); // Пересчитываем каждую секунду (нет массива зависимостей -> на каждый рендер)

  if (isExpired) {
    return (
      <div className={`flex items-center text-xs sm:text-sm text-red-600 font-medium ${className}`}>
        <FiAlertTriangle className="mr-1.5 flex-shrink-0" />
        {expiredText}
      </div>
    );
  }

  if (!timeLeft) {
    // Это состояние не должно достигаться, если isExpired уже true, но на всякий случай
    return null;
  }

  // Форматируем вывод
  let displayTime = '';
  if (timeLeft.days && timeLeft.days > 0) {
    displayTime += `${timeLeft.days}д `;
  }
  if (timeLeft.hours !== undefined && (timeLeft.days || timeLeft.hours > 0)) { // Показываем часы, если есть дни или часы > 0
    displayTime += `${String(timeLeft.hours).padStart(2, '0')}:`;
  }
  if (timeLeft.minutes !== undefined) {
    displayTime += `${String(timeLeft.minutes).padStart(2, '0')}:`;
  }
  if (timeLeft.seconds !== undefined) {
    displayTime += `${String(timeLeft.seconds).padStart(2, '0')}`;
  } else {
      displayTime += `00`; // если только минуты, то 00 секунд
  }


  return (
    <div className={`flex items-center text-xs sm:text-sm font-medium text-red-500 ${className}`}>
      <FiClock className="mr-1.5 flex-shrink-0" />
      <span>Осталось: {displayTime.trim()}</span>
    </div>
  );
};

export default CountdownTimer;