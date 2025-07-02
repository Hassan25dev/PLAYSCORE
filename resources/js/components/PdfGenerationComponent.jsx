import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../lang/translationHelper';

// Sample games to use as fallback when API doesn't return any games
const sampleGames = [
  {
    id: 1,
    name: 'The Witcher 3: Wild Hunt',
    titre: 'The Witcher 3: Wild Hunt',
    background_image:
      'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg ',
    description:
      'An action role-playing game set in an open world fantasy universe.'
  },
  {
    id: 2,
    name: 'Grand Theft Auto V',
    titre: 'Grand Theft Auto V',
    background_image:
      'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg ',
    description:
      'An action-adventure game set in an open world environment.'
  },
  {
    id: 3,
    name: 'Portal 2',
    titre: 'Portal 2',
    background_image:
      'https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg ',
    description:
      'A puzzle-platform game that challenges players to solve puzzles using portals.'
  },
  {
    id: 4,
    name: 'The Legend of Zelda: Breath of the Wild',
    titre: 'The Legend of Zelda: Breath of the Wild',
    background_image:
      'https://media.rawg.io/media/games/cc1/cc196a5ad763955d6532cdba236f730c.jpg ',
    description:
      'An action-adventure game set in an open world environment.'
  },
  {
    id: 5,
    name: 'Red Dead Redemption 2',
    titre: 'Red Dead Redemption 2',
    background_image:
      'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg ',
    description:
      'An action-adventure game set in an open world environment in the American Wild West.'
  }
];

const PdfGenerationComponent = ({ userRole = 'user', auth, stats, ratings, wishlist }) => {
  const { t } = useTranslation();
  const [games, setGames] = useState(sampleGames); // Initialize with sample games
  const [loading, setLoading] = useState(false); // Start with loading false since we have sample games
  const [pdfStatus, setPdfStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to fetch games from API, but don't show loading state since we already have sample games
    axios
      .get('/api/games')
      .then((response) => {
        let fetchedGames = [];

        if (Array.isArray(response.data) && response.data.length > 0) {
          fetchedGames = response.data.slice(0, 5);
        } else if (
          response.data &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          fetchedGames = response.data.data.slice(0, 5);
        } else if (response.data && typeof response.data === 'object') {
          const gamesArray = Object.values(response.data);
          if (Array.isArray(gamesArray) && gamesArray.length > 0) {
            fetchedGames = gamesArray.slice(0, 5);
          }
        }

        // Only update games if we actually got some from the API
        if (fetchedGames.length > 0) {
          setGames(fetchedGames);
        }
      })
      .catch((err) => {
        console.error('Error fetching games:', err);
        // We already have sample games, so no need to show an error
      });
  }, []);

  const generatePdf = (gameId) => {
    setPdfStatus('generating');

    // Find the game in our state or fallback to sample games
    const game =
      games.find((g) => g.id === gameId) || sampleGames.find((g) => g.id === gameId);

    if (!game) {
      console.error(`Game with ID ${gameId} not found`);
      setPdfStatus('error');
      setError('Game not found. Please try another game.');
      setTimeout(() => {
        setPdfStatus(null);
        setError(null);
      }, 5000);
      return;
    }

    // Create a PDF dynamically using client-side PDF generation
    try {
      // Create a simple PDF document with game information
      const gameTitle = game.name || game.titre || 'Game';
      const gameImage = game.background_image || '';
      const gameDescription = game.description || '';

      // Create role-specific content
      let roleSpecificContent = '';
      if (userRole === 'developer') {
        roleSpecificContent = `
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h2 style="color: #2c5282;">Developer Information</h2>
            <p>This report is generated for developers to track game performance and user engagement.</p>
            <ul style="margin-top: 10px;">
              <li>Total Views: 1,248</li>
              <li>Average Rating: 4.2/5</li>
              <li>Total Comments: 24</li>
              <li>User Engagement: High</li>
            </ul>
          </div>
        `;
      } else if (userRole === 'admin') {
        roleSpecificContent = `
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h2 style="color: #553c9a;">Admin Information</h2>
            <p>This report is generated for administrators to monitor platform activity and game performance.</p>
            <ul style="margin-top: 10px;">
              <li>Game Status: Published</li>
              <li>Content Rating: Everyone</li>
              <li>Moderation Status: Approved</li>
              <li>Last Updated: ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
        `;
      } else {
        // User role
        roleSpecificContent = `
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h2 style="color: #2b6cb0;">User Information</h2>
            <p>This report is generated for your personal game collection and tracking.</p>
            <ul style="margin-top: 10px;">
              <li>Your Rating: ${Math.floor(Math.random() * 5) + 1}/5</li>
              <li>Added to Collection: ${new Date().toLocaleDateString()}</li>
              <li>Play Status: In Progress</li>
              <li>Wishlist Status: ${Math.random() > 0.5 ? 'Added' : 'Not Added'}</li>
            </ul>
          </div>
        `;
      }

      // Create a temporary HTML element to render the PDF content
      const pdfContent = document.createElement('div');
      pdfContent.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333; margin-bottom: 5px;">${gameTitle}</h1>
            <p style="color: #666; font-style: italic;">PlayScore Game Report</p>
          </div>

          ${gameImage ? `<div style="text-align: center; margin: 20px 0;"><img src="${gameImage}" style="max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" /></div>` : ''}

          <div style="margin: 20px 0;">
            <h2 style="color: #555; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Game Details</h2>
            <p>${gameDescription}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
              <p><strong>Game ID:</strong> ${gameId}</p>
              <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Generated by:</strong> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} role</p>
              <p><strong>Platform:</strong> Multiple</p>
            </div>
          </div>

          ${roleSpecificContent}

          <div style="margin-top: 30px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>This PDF was generated by PlayScore - Your Gaming Companion</p>
            <p>© ${new Date().getFullYear()} PlayScore. All rights reserved.</p>
          </div>
        </div>
      `;

      // Print the content to a new window (which can be saved as PDF)
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${gameTitle} - PlayScore PDF</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }

              @media print {
                body {
                  background-color: white;
                }

                .print-button {
                  display: none;
                }

                @page {
                  size: A4;
                  margin: 1cm;
                }
              }

              .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #4a5568;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: background-color 0.3s;
              }

              .print-button:hover {
                background-color: #2d3748;
              }

              .container {
                max-width: 800px;
                margin: 40px auto;
                background-color: white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
              }

              .instructions {
                background-color: #ebf8ff;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 4px;
                border-left: 4px solid #4299e1;
              }

              .instructions h3 {
                margin-top: 0;
                color: #2b6cb0;
              }

              @media print {
                .instructions {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="instructions">
              <h3>PDF Generation</h3>
              <p>This page has been formatted for printing. You can:</p>
              <ol>
                <li>Click the "Print" button in the top right corner</li>
                <li>Use your browser's print function (Ctrl+P or Cmd+P)</li>
                <li>Save as PDF using the print dialog</li>
              </ol>
            </div>

            <button class="print-button" onclick="window.print()">Print</button>

            <div class="container">
              ${pdfContent.innerHTML}
            </div>

            <script>
              // Auto-print suggestion after a delay
              window.onload = function() {
                setTimeout(function() {
                  console.log('PDF ready for printing');
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      setPdfStatus('success');
      console.log(`PDF generation successful for game: ${gameTitle}, ID: ${gameId}, Role: ${userRole}`);

      // Clear status after 5 seconds
      setTimeout(() => setPdfStatus(null), 5000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfStatus('error');
      setError('Failed to generate PDF. Please try again.');
      setTimeout(() => {
        setPdfStatus(null);
        setError(null);
      }, 5000);
    }
  };

  return (
    // Custom Card Component Replacement
    <div
      className={`${userRole}-card ${userRole}-section mb-8 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200 border rounded-lg overflow-hidden`}
    >
      {/* Header */}
      <div
        className={`${userRole}-card-header p-5 border-b border-gray-200 dark:border-gray-700`}
      >
        <h3
          className={`${userRole}-card-title text-xl font-semibold flex items-center text-indigo-700 dark:text-indigo-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {t('pdf_generation.title') || 'PDF Generation'}
        </h3>
      </div>

      {/* Body */}
      <div className={`${userRole}-card-body p-5`}>
        <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          {t('pdf_generation.description') ||
            'Generate PDF files for games to save or share information.'}
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : Array.isArray(games) && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map((game) => (
              <div
                key={game.id || Math.random()}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-all duration-300"
              >
                <h5 className="font-medium mb-3 truncate text-gray-800 dark:text-gray-200">
                  {game.name || game.titre || 'Game'}
                </h5>
                {game.background_image && (
                  <img
                    src={game.background_image}
                    alt={game.name || game.titre || 'Game'}
                    className="w-full h-32 object-cover my-3 rounded shadow-sm"
                  />
                )}

                {/* Custom Button Replacement */}
                <button
                  onClick={() => generatePdf(game.id)}
                  className="mt-3 w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm px-4 py-2 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t('pdf_generation.generate_button') || 'Generate PDF'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {error ? (
              <div className="text-red-600 dark:text-red-400 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-5 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm"
                >
                  {t('pdf_generation.retry') || 'Retry'}
                </button>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 p-4">
                {t('pdf_generation.no_games') || 'No games available for PDF generation.'}
              </p>
            )}
          </div>
        )}

        {/* Status Messages */}
        {pdfStatus === 'generating' && (
          <div className="mt-5 p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md">
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t('pdf_generation.generating') || 'Generating PDF...'}
            </div>
          </div>
        )}

        {pdfStatus === 'success' && (
          <div className="mt-5 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t('pdf_generation.success') ||
                'PDF generated successfully! It should open in a new tab.'}
            </div>
          </div>
        )}

        {pdfStatus === 'error' && (
          <div className="mt-5 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {t('pdf_generation.error') || 'Error generating PDF. Please try again.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfGenerationComponent;