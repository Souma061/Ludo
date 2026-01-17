import { useEffect, useRef, useState } from "react";
import type { Corrdinates } from "../constants/coordinates";

/**
 * Hook to animate token movement box-by-box with jumping animation
 * Returns the current animated position and whether the animation is in progress
 */
export const useBoxByBoxAnimation = (
  targetPosition: Corrdinates,
  pathPositions: Corrdinates[] = [],
) => {
  const [currentPosition, setCurrentPosition] =
    useState<Corrdinates>(targetPosition);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentHop, setCurrentHop] = useState(0);
  const previousTargetRef = useRef(targetPosition);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // If position hasn't changed, don't animate
    if (
      targetPosition.r === previousTargetRef.current.r &&
      targetPosition.c === previousTargetRef.current.c
    ) {
      return;
    }

    // Clear any ongoing animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If no path provided or path is just the target, jump directly
    if (!pathPositions || pathPositions.length === 0) {
      setCurrentPosition(targetPosition);
      previousTargetRef.current = targetPosition;
      setIsAnimating(false);
      return;
    }

    // Start animation
    setIsAnimating(true);
    setCurrentHop(0);

    let stepIndex = 0;
    const hopDuration = 200; // ms per hop

    const animateNextHop = () => {
      if (stepIndex < pathPositions.length) {
        setCurrentPosition(pathPositions[stepIndex]);
        setCurrentHop(stepIndex);
        stepIndex++;

        timeoutRef.current = window.setTimeout(animateNextHop, hopDuration);
      } else {
        // Animation complete
        setCurrentPosition(targetPosition);
        previousTargetRef.current = targetPosition;
        setIsAnimating(false);
        setCurrentHop(0);
      }
    };

    // Start the animation sequence
    animateNextHop();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [targetPosition, pathPositions]);

  return { currentPosition, isAnimating, currentHop };
};
