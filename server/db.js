import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "users.json");

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
}

// Read database
export const readDB = () => {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
};

// Write database
export const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// User operations
export const User = {
    async findOne(query) {
        const db = readDB();
        const user = db.users.find(u => {
            if (query.email) return u.email === query.email;
            if (query._id) return u._id === query._id;
            return false;
        });
        return user || null;
    },

    async save(userData) {
        const db = readDB();
        const newUser = {
            _id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        db.users.push(newUser);
        writeDB(db);
        return newUser;
    },

    async findAll() {
        const db = readDB();
        return db.users;
    }
};

