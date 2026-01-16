import { useEffect, useRef, useState } from 'react';

/**
 * Hook to observe when an element enters the viewport
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Percentage of element visibility to trigger (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {boolean} options.once - Whether to only trigger once
 * @returns {Array} - [ref, isVisible] tuple
 */
export const useIntersectionObserver = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
};
