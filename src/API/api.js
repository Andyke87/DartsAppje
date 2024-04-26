import axios from "axios";

export const getPlayers = async () => {
    return await axios.get("http://localhost:8000/api/players/");
};
export const addPlayer = async (player) => {
    return await axios.post("http://localhost:8000/api/player/add/", player);
};
export const deletePlayer = async (id) => {
    return await axios.delete(`http://localhost:8000/api/player/delete/${id}`);
};


export const getGames = async () => {
    return await axios.get("http://localhost:8000/api/games/");
};
export const addGame = async (game) => {
    return await axios.post("http://localhost:8000/api/game/add/", game);
};
export const deleteGame = async (id) => {
    return await axios.delete(`http://localhost:8000/api/game/delete/${id}`);
};


export const getThrowouts = async () => { 
    return await axios.get("http://localhost:8000/api/throwouts/");
}
