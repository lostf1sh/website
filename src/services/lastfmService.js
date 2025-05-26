import axios from 'axios';

const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
const user = 'molishu';

export const getRecentTracks = async () => {
    try {
        const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'user.getrecenttracks',
                user: user,
                api_key: apiKey,
                format: 'json',
                limit: 50,
            }
        });
        return response.data.recenttracks.track;
    } catch (error) {
        console.error('Error fetching recent tracks:', error);
        throw error;
    }
};

export const getTopTracks = async () => {
    try {
        const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'user.gettoptracks',
                user: user,
                api_key: apiKey,
                format: 'json',
                period: '7day',
                limit: 10
            }
        });
        return response.data.toptracks.track;
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        throw error;
    }
};
