import {
  searchUsersService,
  getAllUsersService,
} from "../service/user.service.js";

export const searchUsersController = async (req, res) => {
  try {
    const query = req.query.q;

    const users = await searchUsersService(query);
    return res.json(users);
  } catch (err) {
    console.error("Search error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
