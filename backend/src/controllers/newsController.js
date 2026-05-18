import { mockNews } from '../data/mockNews.js';
import { formatSuccess } from '../utils/responseFormatter.js';

/** GET /api/news — returns all mock news items */
export const getNews = (req, res) => {
  res.json(formatSuccess(mockNews));
};
