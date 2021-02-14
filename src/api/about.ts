import {EHandler, Handler} from "../utils/types";

const VERSION = process.env.VERSION || "unknown";

const about: Handler = (req, res) => {
    res.send(`DBMS Project Backend API ${VERSION}`);
};

export default about as EHandler