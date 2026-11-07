import 'dotenv/config';
import { app } from "./src/app.js";
import { connectToDB } from "./src/config/database.js";

connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
