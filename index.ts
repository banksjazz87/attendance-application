import dotenv from "dotenv";
import express, {Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.post('/login', (req: Request, res: Response): any => {
    if (req.body.name === process.env.TEST_USER && req.body.password === process.env.TEST_PASSWORD) {
        res.send({"message": "valid"});
    } else {
        res.send({"message": "invalid"});
    }
});

const port = process.env.PORT || 3500;

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});