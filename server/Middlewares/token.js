import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
    try {

        const token = req.cookies?.access_token;

        if (!token) {
            return res.status(400).send({ status: "error", message: "Session Expired - Please login again." })
        }

        jwt.verify(token, process.env.SECRET_KEY, (error, decodedUser) => {

            if (error) {
                return res.status(405).send({ status: "error", message: "Token Malformed - Please login again." });
            }

            req.user = decodedUser;
            next();
        })
    } catch (err) {
        return res.status(400).send({ status: "error", message: "Session Expired - Please login again." });
    }
};

export const socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) {
            return next(new Error("An error occured - Please Try Again."));
        }

        const socketToken = socket.request.cookies["access_token"];
        
        if (!socketToken) {
            socket.disconnect();
            return next(new Error("Session Expired - Please login again"));
        }

        jwt.verify(socketToken, process.env.SECRET_KEY, (error, decodedUser) => {
            if (error) {
                socket.disconnect();
                return next(new Error("Token Malformed - Please login again"));
            }

            socket.user = decodedUser; // Attach user information to the socket object
            next();
        });
        
    } catch (err) {
        console.log("err: ", err);
        next(new Error("Internal Server Error"));
    }
};