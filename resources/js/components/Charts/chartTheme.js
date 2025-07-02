
/**
 * Shared chart theme configuration
 *
 * This file contains shared styling and configuration for all chart components
 * to ensure consistent appearance and behavior across the application.
 */

// Color palette for charts
export const chartColors = {
  // Primary colors
  primary: '#4e63ff',
  secondary: '#8338ec',
  success: '#4CAF50',
  info: '#2196F3',
  warning: '#FFC107',
  danger: '#F44336',

  // Neutral colors
  light: '#f8fafc',
  dark: '#1e2235',

  // Status colors
  published: '#4CAF50',
  pending: '#2196F3',
  rejected: '#F44336',
  draft: '#9E9E9E',

  // Rating colors
  rating1: '#F44336',
  rating2: '#FF9800',
  rating3: '#FFC107',
  rating4: '#8BC34A',
  rating5: '#4CAF50',

  // Chart gradients
  primaryGradient: ['rgba(78, 99, 255, 0.8)', 'rgba(78, 99, 255, 0.2)'],
  secondaryGradient: ['rgba(131, 56, 236, 0.8)', 'rgba(131, 56, 236, 0.2)'],
};

// Font configuration
export const chartFonts = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  size: {
    title: 16,
    label: 12,
    tick: 11,
    tooltip: 12,
  },
  weight: {
    normal: 400,
    medium: 500,
    bold: 600,
  }
};

// Responsive breakpoints
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: {
          family: chartFonts.family,
          size: chartFonts.size.label,
          weight: chartFonts.weight.medium,
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(30, 34, 53, 0.8)',
      titleFont: {
        family: chartFonts.family,
        size: chartFonts.size.tooltip,
        weight: chartFonts.weight.bold,
      },
      bodyFont: {
        family: chartFonts.family,
        size: chartFonts.size.tooltip,
        weight: chartFonts.weight.normal,
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 6,
      usePointStyle: true,
      caretSize: 6,
    },
    title: {
      display: true,
      font: {
        family: chartFonts.family,
        size: chartFonts.size.title,
        weight: chartFonts.weight.bold,
      },
      padding: {
        top: 10,
        bottom: 20,
      },
      color: chartColors.dark,
    },
  },
  layout: {
    padding: {
      top: 5,
      right: 16,
      bottom: 16,
      left: 16,
    },
  },
};

// Get responsive options based on screen width
export const getResponsiveOptions = (width) => {
  if (width < breakpoints.xs) {
    // Extra small mobile options (below 480px)
    return {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            padding: 8,
            font: {
              size: chartFonts.size.label - 2,
            },
          },
        },
        title: {
          font: {
            size: chartFonts.size.title - 3,
          },
          padding: {
            top: 5,
            bottom: 10,
          },
        },
        tooltip: {
          titleFont: {
            size: chartFonts.size.tooltip - 2,
          },
          bodyFont: {
            size: chartFonts.size.tooltip - 2,
          },
          padding: 8,
          boxPadding: 4,
          caretSize: 5,
        }
      },
      layout: {
        padding: {
          top: 2,
          right: 8,
          bottom: 8,
          left: 8,
        },
      },
      elements: {
        point: {
          radius: 3,
          hoverRadius: 4,
        },
        line: {
          borderWidth: 2,
        },
        arc: {
          borderWidth: 1,
          hoverBorderWidth: 2,
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: chartFonts.size.tick - 2,
            },
            maxRotation: 45,
            minRotation: 45,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            font: {
              size: chartFonts.size.tick - 2,
            },
            padding: 4,
          },
          grid: {
            tickLength: 2,
          },
        },
      },
    };
  } else if (width < breakpoints.sm) {
    // Small mobile options (below 640px)
    return {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            padding: 10,
            font: {
              size: chartFonts.size.label - 1,
            },
          },
        },
        title: {
          font: {
            size: chartFonts.size.title - 2,
          },
          padding: {
            top: 8,
            bottom: 15,
          },
        },
        tooltip: {
          titleFont: {
            size: chartFonts.size.tooltip - 1,
          },
          bodyFont: {
            size: chartFonts.size.tooltip - 1,
          },
          padding: 10,
        }
      },
      layout: {
        padding: {
          top: 4,
          right: 12,
          bottom: 12,
          left: 12,
        },
      },
      elements: {
        point: {
          radius: 3.5,
          hoverRadius: 5,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: chartFonts.size.tick - 1,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: chartFonts.size.tick - 1,
            },
          },
        },
      },
    };
  } else if (width < breakpoints.md) {
    // Tablet options (below 768px)
    return {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            padding: 12,
            font: {
              size: chartFonts.size.label,
            },
          },
        },
        title: {
          font: {
            size: chartFonts.size.title - 1,
          },
        },
      },
      layout: {
        padding: {
          top: 5,
          right: 14,
          bottom: 14,
          left: 14,
        },
      },
    };
  }

  // Default (desktop) options
  return {};
};

// Helper to merge options with defaults
export const mergeWithDefaultOptions = (customOptions, screenWidth) => {
  const responsiveOptions = getResponsiveOptions(screenWidth);
  const mergedOptions = {
    ...defaultChartOptions,
    ...responsiveOptions,
    ...customOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      ...(responsiveOptions.plugins || {}),
      ...(customOptions.plugins || {}),
    },
  };

  // Handle layout options
  if (responsiveOptions.layout || customOptions.layout) {
    mergedOptions.layout = {
      ...defaultChartOptions.layout,
      ...(responsiveOptions.layout || {}),
      ...(customOptions.layout || {}),
      padding: {
        ...defaultChartOptions.layout.padding,
        ...(responsiveOptions.layout?.padding || {}),
        ...(customOptions.layout?.padding || {}),
      }
    };
  }

  // Handle elements options for better touch interaction
  if (responsiveOptions.elements || customOptions.elements) {
    mergedOptions.elements = {
      ...(responsiveOptions.elements || {}),
      ...(customOptions.elements || {}),
    };
  }

  // Handle scales options
  if (responsiveOptions.scales || customOptions.scales) {
    mergedOptions.scales = {
      ...(responsiveOptions.scales || {}),
      ...(customOptions.scales || {}),
    };
  }

  // Add touch-specific options for mobile
  if (screenWidth < breakpoints.sm) {
    // Increase hit radius for better touch interaction
    mergedOptions.hitRadius = 6;

    // Ensure tooltips are touch-friendly
    if (mergedOptions.plugins && mergedOptions.plugins.tooltip) {
      mergedOptions.plugins.tooltip = {
        ...mergedOptions.plugins.tooltip,
        // Ensure tooltips are displayed on tap
        mode: 'nearest',
        intersect: false,
      };
    }
  }

  return mergedOptions;
};
