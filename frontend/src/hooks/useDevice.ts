import { useMediaQuery } from 'react-responsive';

/**
 * Hook to detect device type, screen size and orientation using react-responsive.
 * Preserves 100% of the existing CSS and design system.
 */
export const useDevice = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isPortrait = useMediaQuery({ orientation: 'portrait' });
  const isLandscape = useMediaQuery({ orientation: 'landscape' });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isPortrait,
    isLandscape,
  };
};

export default useDevice;
