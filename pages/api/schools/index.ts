import type { NextApiRequest, NextApiResponse } from 'next'
import { withMiddlewares } from '../../../middlewares'
import { School } from '../../../database/schema';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const schools = await School.find({});
      res.status(200).json(schools);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
export default withMiddlewares(handler)
