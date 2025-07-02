import axios from 'axios';

// Set the base URL for Axios
axios.defaults.baseURL = '/api';

// User Authentication
export const registerUser = async (userData) => {
    return await axios.post('/register', userData);
};

export const loginUser = async (credentials) => {
    return await axios.post('/login', credentials);
};

export const logoutUser = async () => {
    return await axios.post('/logout');
};

// Game Management
export const fetchGames = async (params = {}) => {
    return await axios.get('/games', { params });
};

export const fetchGameDetails = async (id) => {
    return await axios.get(`/games/${id}`);
};

export const createGame = async (gameData) => {
    return await axios.post('/games', gameData);
};

// Evaluation
export const submitEvaluation = async (evaluationData) => {
    return await axios.post('/evaluations', evaluationData);
};

export const updateEvaluation = async (evaluationId, evaluationData) => {
    return await axios.put(`/evaluations/${evaluationId}`, evaluationData);
};

export const deleteEvaluation = async (evaluationId) => {
    return await axios.delete(`/evaluations/${evaluationId}`);
};

// Fetch genres and platforms
export const fetchGenres = async () => {
    return await axios.get('/genres');
};

export const fetchPlatforms = async () => {
    return await axios.get('/platforms');
};

// Fetch user activity data for charts
export const fetchUserActivityData = async (period = '12months') => {
    return await axios.get('/charts/user-activity', { params: { period } });
};
