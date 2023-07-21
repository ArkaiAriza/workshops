// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

type Data = JwtPayload;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      if (process.env.JWT_SECRET) {
        const decoded = jwt.verify(req.body, process.env.JWT_SECRET);

        if (decoded) {
          if (typeof decoded === 'string') {
            res.status(200).json({ payload: decoded });
          } else {
            res.status(200).json(decoded);
          }
        } else {
          res.status(400).json({ error: 'Wrong token format' });
        }
      }
    } catch (e) {
      console.log(e);

      res.status(500).json({ error: e });
    }
  }
  res.status(200);
}
