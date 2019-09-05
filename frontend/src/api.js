import axios from "axios";

const instance = axios.create({
    baseURL: window.location.origin,
    timeout: 1000,
});

export const getGames = () => instance.get('/api/game');
export const getGame = (game_id) => instance.get(`/api/game/${game_id}`);
export const getGameCells = (game_id) => instance.get(`/api/game/${game_id}/cell`);
export const newGame = () => instance.post('/api/game');
export const bombCell = (game_id, cell_id) => instance.patch(`/api/game/${game_id}/cell/${cell_id}`, {bomb: true});
