import type { NextApiRequest, NextApiResponse } from 'next'
import { withMiddlewares } from '../../../../../middlewares'
import { School } from '../../../../../database/schema';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { division } = req.query;

  if (req.method === 'GET') {
    try {
      const schools = await School.find({ division });
      res.status(200).json(schools);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch schools by zone' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
export default withMiddlewares(handler)
