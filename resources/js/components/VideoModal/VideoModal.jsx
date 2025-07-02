import React, { useState, useEffect, useRef } from 'react';
import './VideoModal.css';

const VideoModal = ({ videoSrc, isOpen, onClose }) => {
  const videoRef = useRef(null);
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const controlsTimeoutRef = useRef(null);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === ' ' && videoRef.current) {
        // Space bar to toggle play/pause
        e.preventDefault();
        togglePlay();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, onClose, videoSrc, isFullscreen, isPlaying]);

  // Play video when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Small delay to ensure the modal is fully rendered
      setTimeout(() => {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error playing video in fullscreen:', error);
          setIsPlaying(false);
        });
      }, 100);
    }
  }, [isOpen]);

  // Update video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);

      // Update progress bar
      if (progressBarRef.current) {
        const progress = (video.currentTime / video.duration) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', updateProgress);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [isOpen]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!isOpen) return;

    const handleActivity = () => {
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      // Hide controls after 3 seconds of inactivity
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    // Show controls on any user interaction
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('touchstart', handleActivity);
    document.addEventListener('click', handleActivity);

    // Initial setup
    handleActivity();

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('click', handleActivity);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, isPlaying]);

  // Handle click outside the video to close the modal
  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop, not on the content
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  // Prevent clicks inside the content from closing the modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressBarClick = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;

    video.currentTime = pos * video.duration;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  // Enter fullscreen
  const enterFullscreen = () => {
    const videoContainer = contentRef.current;
    if (!videoContainer) return;

    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
      videoContainer.msRequestFullscreen();
    }

    setIsFullscreen(true);
  };

  // Exit fullscreen
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    setIsFullscreen(false);
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Detect tablet and orientation
  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      // Check if device is a tablet (768px-1024px)
      const isTabletDevice = window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches;
      setIsTablet(isTabletDevice);

      // Check orientation
      const isLandscapeOrientation = window.matchMedia('(orientation: landscape)').matches;
      setIsLandscape(isLandscapeOrientation);
    };

    // Initial check
    checkDeviceAndOrientation();

    // Listen for resize and orientation change events
    window.addEventListener('resize', checkDeviceAndOrientation);
    window.addEventListener('orientationchange', checkDeviceAndOrientation);

    return () => {
      window.removeEventListener('resize', checkDeviceAndOrientation);
      window.removeEventListener('orientationchange', checkDeviceAndOrientation);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="video-modal-backdrop"
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      <div
        className={`video-modal-content ${isFullscreen ? 'fullscreen' : ''}`}
        ref={contentRef}
        onClick={handleContentClick}
      >
        <button
          className="video-modal-close"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close fullscreen video"
          type="button"
        >
          <span className="close-icon">×</span>
          <span className="close-text">Close</span>
        </button>

        <div className="video-container">
          <video
            ref={videoRef}
            src={videoSrc}
            className="video-modal-player"
            playsInline
            onClick={togglePlay}
          />

          {/* Tablet-specific controls */}
          {isTablet && (
            <div className={`tablet-video-controls ${isLandscape ? 'landscape' : 'portrait'}`}>
              <button
                className="tablet-control-button"
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = Math.max(0, video.currentTime - 10);
                  }
                }}
                aria-label="Rewind 10 seconds"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16z"/>
                </svg>
              </button>

              <button
                className="tablet-control-button"
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = Math.min(video.duration, video.currentTime + 10);
                  }
                }}
                aria-label="Forward 10 seconds"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm1.1 11h.85v-3.26l1.01.31v-.69l-1.77-.63h-.09V16z"/>
                </svg>
              </button>

              <button
                className="tablet-control-button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Custom video controls */}
          <div className={`video-controls ${showControls ? 'visible' : ''}`}>
            <button
              className="control-button play-pause"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <div className="time-display current-time">{formatTime(currentTime)}</div>

            <div className="progress-bar-container" onClick={handleProgressBarClick}>
              <div className="progress-bar-background"></div>
              <div className="progress-bar" ref={progressBarRef}></div>
            </div>

            <div className="time-display duration">{formatTime(duration)}</div>

            <button
              className="control-button fullscreen"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Play/pause overlay for mobile */}
          <div
            className={`play-overlay ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
          >
            <div className="play-icon">
              {!isPlaying && (
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
                  <path fill="white" d="M10 8v8l6-4z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
