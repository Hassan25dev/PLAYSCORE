import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../lang/translationHelper';

// Sample games for fallback when API fails
const sampleGames = [
  {
    id: 1,
    name: 'The Witcher 3: Wild Hunt',
    titre: 'The Witcher 3: Wild Hunt',
    background_image: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg ',
    description: 'An action role-playing game set in an open world environment.'
  },
  {
    id: 2,
    name: 'Grand Theft Auto V',
    titre: 'Grand Theft Auto V',
    background_image: 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg ',
    description: 'An action-adventure game set in an open world environment.'
  },
  {
    id: 3,
    name: 'Portal 2',
    titre: 'Portal 2',
    background_image: 'https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg ',
    description: 'A puzzle-platform game that challenges players to solve puzzles using portals.'
  }
];

const XmlImportExportComponent = ({ userRole, auth, stats, ratings, wishlist }) => {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xmlStatus, setXmlStatus] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [importStatus, setImportStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    // Set sample games immediately to ensure we have something to display
    setGames(sampleGames);
    // Fetch games from API
    axios.get('/api/games')
      .then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setGames(response.data.slice(0, 5));
        } else if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setGames(response.data.data.slice(0, 5));
        } else if (response.data && typeof response.data === 'object') {
          const gamesArray = Object.values(response.data);
          if (Array.isArray(gamesArray) && gamesArray.length > 0) {
            setGames(gamesArray.slice(0, 5));
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  }, []);

  const exportToXml = (gameId) => {
    setXmlStatus('generating');
    const game = games.find(g => g.id === gameId) || sampleGames.find(g => g.id === gameId);
    if (!game) {
      console.error('Game not found with ID:', gameId);
      setXmlStatus('error');
      setError('Game not found. Please try another game.');
      setTimeout(() => {
        setXmlStatus(null);
        setError(null);
      }, 5000);
      return;
    }

    let endpoint = `/api/games/${gameId}/xml`;
    if (userRole === 'developer') {
      endpoint = `/developer-test-xml/${gameId}`;
    } else if (userRole === 'admin') {
      endpoint = `/admin-test-xml/${gameId}`;
    } else {
      endpoint = `/api/user/games/${gameId}/xml`;
    }

    try {
      window.open(endpoint, '_blank');
      setXmlStatus('success');
      setTimeout(() => setXmlStatus(null), 5000);
    } catch (error) {
      console.error('Error exporting XML:', error);
      setXmlStatus('error');
      setError('Failed to generate XML. Please try again.');
      setTimeout(() => {
        setXmlStatus(null);
        setError(null);
      }, 5000);
    }
  };

  const exportUserDataToXml = () => {
    setXmlStatus('generating');
    let endpoint = `/api/user/export-xml`;
    if (userRole === 'developer') {
      endpoint = `/developer-export-xml`;
    } else if (userRole === 'admin') {
      endpoint = `/admin-export-xml`;
    }

    try {
      window.open(endpoint, '_blank');
      setXmlStatus('success');
      setTimeout(() => setXmlStatus(null), 5000);
    } catch (error) {
      console.error('Error exporting XML:', error);
      setXmlStatus('error');
      setError('Failed to generate XML. Please try again.');
      setTimeout(() => {
        setXmlStatus(null);
        setError(null);
      }, 5000);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFile(files[0]);
    setSelectedFiles(files);
    setUploadProgress(0);
    setBatchProgress({ current: 0, total: files.length });
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/xml/check-auth', {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        withCredentials: true
      });
      console.log('Auth check response:', response.data);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Authentication failed. Please log in again.');
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  const importSingleFile = async (file, endpoint) => {
    const formData = new FormData();
    formData.append('xml_file', file);
    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
          'Accept': 'application/json'
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      console.log(`File ${file.name} imported successfully:`, response.data);
      return { success: true, data: response.data, file };
    } catch (error) {
      console.error(`Error importing file ${file.name}:`, error);
      return {
        success: false,
        error,
        file,
        message: error.response?.data?.message || 'Import failed'
      };
    }
  };

  const importXml = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to import');
      setTimeout(() => setError(null), 5000);
      return;
    }

    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    setImportStatus('importing');
    setUploadProgress(0);
    setBatchProgress({ current: 0, total: selectedFiles.length });

    let endpoint = '/api/user/import-xml';
    const results = [];
    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setBatchProgress({ current: i + 1, total: selectedFiles.length });
      const result = await importSingleFile(file, endpoint);
      results.push(result);
      if (result.success) successCount++;
      setUploadProgress(0);
    }

    if (successCount === selectedFiles.length) {
      setImportStatus('success');
      setError(null);
    } else if (successCount > 0) {
      setImportStatus('partial');
      setError(`Imported ${successCount} of ${selectedFiles.length} files successfully`);
    } else {
      setImportStatus('error');
      setError('Failed to import any files');
    }

    console.log('Import results:', results);

    setTimeout(() => {
      setImportStatus(null);
      if (successCount === selectedFiles.length) setError(null);
    }, 5000);
  };

  return (
    // Custom Card Component Replacement
    <div className={`${userRole}-card ${userRole}-section mb-8 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200 border rounded-lg overflow-hidden`}>
      {/* Header */}
      <div className={`${userRole}-card-header p-5 border-b border-gray-200 dark:border-gray-700`}>
        <h3 className={`${userRole}-card-title text-xl font-semibold flex items-center text-indigo-700 dark:text-indigo-300`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          XML Import/Export
        </h3>
      </div>

      {/* Body */}
      <div className={`${userRole}-card-body p-5`}>
        <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          Import and export your game data in XML format for backup or sharing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Export to XML</h3>
            <p className="text-sm text-gray-600 mb-4">
              Export your user data, ratings, and wishlist to XML format.
            </p>
            <button
              onClick={exportUserDataToXml}
              disabled={xmlStatus === 'generating'}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm rounded"
            >
              {xmlStatus === 'generating' ? 'Exporting...' : 'Export My Data'}
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Import from XML</h3>
            <p className="text-sm text-gray-600 mb-4">
              Import game data from an XML file.
            </p>
            <div className="mb-4">
              <input
                type="file"
                accept=".xml,application/xml,text/xml"
                onChange={handleFileChange}
                multiple
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Only XML files are accepted (.xml). The system supports various XML formats for game and user data.
              </p>
              {selectedFiles.length > 0 && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {selectedFiles.length === 1 ? 'Selected file:' : `Selected files: (${selectedFiles.length})`}
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 max-h-24 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {importStatus === 'importing' && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300 mb-1">
                  <span>
                    {batchProgress.total > 1
                      ? `Processing file ${batchProgress.current}/${batchProgress.total}`
                      : 'Uploading...'}
                  </span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={importXml}
              disabled={importStatus === 'importing' || selectedFiles.length === 0}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm rounded"
            >
              {importStatus === 'importing'
                ? batchProgress.total > 1
                  ? 'Importing files...'
                  : 'Importing...'
                : selectedFiles.length > 1
                  ? `Import ${selectedFiles.length} Files`
                  : 'Import XML'}
            </button>
          </div>
        </div>

        {(xmlStatus === 'success' || importStatus === 'success') && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
            {xmlStatus === 'success' ? 'XML export completed successfully!' : 'XML import completed successfully!'}
          </div>
        )}

        {importStatus === 'partial' && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded">
            {error || 'Some files were imported successfully, but others failed.'}
          </div>
        )}

        {(xmlStatus === 'error' || importStatus === 'error' || (error && importStatus !== 'partial')) && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
            {error || 'There was an error. Please try again.'}
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-2">Export Game Data</h3>
          <p className="text-sm text-gray-600 mb-4">
            Export specific game data to XML format.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : Array.isArray(games) && games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {games.map(game => (
                <div
                  key={game.id || Math.random()}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={game.background_image || game.image_arriere_plan || 'https://via.placeholder.com/300x150?text=Game+Image '}
                      alt={game.name || game.titre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 truncate">
                      {game.name || game.titre}
                    </h4>
                    <button
                      onClick={() => exportToXml(game.id)}
                      className="mt-3 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm px-4 py-2 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t('xml_import_export.export_game_button') || 'Export as XML'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">No games available for export.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XmlImportExportComponent;