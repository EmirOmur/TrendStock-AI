import { mockProducts } from '../data/mockProducts.js';
import { formatSuccess, formatError } from '../utils/responseFormatter.js';

/** GET /api/products — returns all products (no risk scores) */
export const getAllProducts = (req, res) => {
  res.json(formatSuccess(mockProducts));
};

/** GET /api/products/:id — returns a single product by ID */
export const getProductById = (req, res) => {
  const product = mockProducts.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json(formatError(`Product not found: ${req.params.id}`));
  }

  res.json(formatSuccess(product));
};
