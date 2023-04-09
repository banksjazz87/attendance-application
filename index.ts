import dotenv from "dotenv";
import express, {Express, Request, Response } from "express";
import path from "path";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const port = process.env.PORT || 3500;

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});