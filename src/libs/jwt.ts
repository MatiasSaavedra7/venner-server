import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";

export function createAccessToken(payload: any) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "30min" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}
