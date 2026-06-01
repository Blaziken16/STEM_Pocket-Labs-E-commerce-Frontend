import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import { Product, User, CartItem, Order, OrderStatus, PaymentStatus } from './src/types';

const PORT = 3000;
const JWT_SECRET = process.env.GEMINI_API_KEY || 'toybox_fallback_jwt_secret_99XYZ';

// In-memory data store
const products: Product[] = [
  {
    id: 'physics-kit-10th',
    name: 'Physics Kit for 10th Standard',
    price: 49.99,
    category: 'Physics',
    stock: 15,
    description: "Hands-on physics kit covering 10th standard Ohm's law, magnetism, reflection/refraction of light, and magnetic field lines with multi-use circuits and optical benches.",
    image: 'physics'
  },
  {
    id: 'chemistry-kit-10th',
    name: 'Chemistry Kit for 10th Standard',
    price: 54.99,
    category: 'Chemistry',
    stock: 12,
    description: "Master chemical reactions, acid-base neutralizations, and safe metal oxidation. Comes with child-safe chemicals, 4 high-grade test tubes, standard beaker, and detailed instructional guides.",
    image: 'chemistry'
  },
  {
    id: 'little-laboratory-combo',
    name: 'Little Laboratory Combo of Phy and Chem',
    price: 89.99,
    category: 'Jumbo Kits',
    stock: 8,
    description: "The ultimate dual-subject science suite. Bundle kit with all materials from physics circuits, optics, chemical indicator tests, pH meters, and premium safety gear.",
    image: 'jumbokit'
  }
];

interface DBUser extends User {
  passwordHash: string;
}

const users: DBUser[] = [
  {
    id: 'user-alex',
    email: 'alex@example.com',
    name: 'Alex Playmaker',
    passwordHash: 'password', // Plain password for prototype simplicity
    isPremium: true,
    memberSince: 'October 2023'
  }
];

// Carts in-memory: userId -> CartItem[]
const carts = new Map<string, CartItem[]>();

// Pre-fill alex's cart for prototype starting state
carts.set('user-alex', [
  { id: 'cart-item-1', productId: 'sleepy-elephant-plush', quantity: 1 },
  { id: 'cart-item-2', productId: 'wooden-train-set', quantity: 1 }
]);

// Orders in-memory: userId -> Order[]
const orders = new Map<string, Order[]>();

// Pre-fill alex's past orders
orders.set('user-alex', [
  {
    id: '#12345',
    date: '2024-05-15',
    total: 45.00,
    paymentMethod: 'COD',
    paymentStatus: 'SUCCESSFUL',
    orderStatus: 'SHIPPED',
    items: [
      {
        productId: 'bouncy-dino-hopper',
        name: 'Bouncy Dino Hopper',
        quantity: 1,
        pricePaid: 19.99,
        image: 'dino'
      }
    ]
  },
  {
    id: '#12344',
    date: '2024-04-22',
    total: 89.50,
    paymentMethod: 'COD',
    paymentStatus: 'SUCCESSFUL',
    orderStatus: 'DELIVERED',
    items: [
      {
        productId: 'stacking-rainbow-arches',
        name: 'Stacking Rainbow Arches',
        quantity: 3,
        pricePaid: 29.99,
        image: 'rainbow'
      }
    ]
  }
]);

// Express configuration
const app = express();
app.use(express.json());

// Extend Express Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Authentication Middleware
function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header with Bearer token is required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// --- PUBLIC ROUTES ---

// GET /products
app.get('/api/products', (req: Request, res: Response) => {
  res.json(products);
});

// GET /products/:id
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// --- AUTH ROUTES ---

// POST /auth/register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser: DBUser = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    name,
    passwordHash: password, // simplified hashing
    isPremium: false,
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };

  users.push(newUser);
  carts.set(newUser.id, []);
  orders.set(newUser.id, []);

  // Sign Token
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  
  // Return User (omit passwordHash)
  const { passwordHash, ...userResponse } = newUser;
  res.status(201).json({ token, user: userResponse });
});

// POST /auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  const { passwordHash, ...userResponse } = user;
  res.json({ token, user: userResponse });
});

// --- CART ROUTES (REQUIRES AUTH) ---

// GET /cart
app.get('/api/cart', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const userCart = carts.get(userId) || [];
  
  // Populate fully with product details
  const populatedCart = userCart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  });

  res.json(populatedCart);
});

// POST /cart/add
app.post('/api/cart/add', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'ProductId is required' });
  }

  const qty = parseInt(quantity) || 1;
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  let userCart = carts.get(userId) || [];
  const existingIndex = userCart.findIndex(item => item.productId === productId);

  if (existingIndex >= 0) {
    // Increment quantity
    userCart[existingIndex].quantity += qty;
  } else {
    // Add new item
    userCart.push({
      id: `cart-item-${Date.now()}`,
      productId,
      quantity: qty
    });
  }

  carts.set(userId, userCart);

  // Return fully populated cart response
  const populatedCart = userCart.map(item => {
    const p = products.find(prod => prod.id === item.productId);
    return { ...item, product: p };
  });

  res.json(populatedCart);
});

// DELETE /cart/:itemId
app.delete('/api/cart/:itemId', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const { itemId } = req.params;

  let userCart = carts.get(userId) || [];
  userCart = userCart.filter(item => item.id !== itemId && item.productId !== itemId); // support deletion by either item ID or product ID for convenience
  carts.set(userId, userCart);

  // Return populated cart
  const populatedCart = userCart.map(item => {
    const p = products.find(prod => prod.id === item.productId);
    return { ...item, product: p };
  });

  res.json(populatedCart);
});

// --- ORDER ROUTES (REQUIRES AUTH) ---

// POST /orders
app.post('/api/orders', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const { paymentMethod, directItems, address } = req.body;

  if (paymentMethod !== 'COD') {
    return res.status(400).json({ error: 'Only Cash on Delivery (COD) is supported as paymentMethod currently' });
  }

  let itemsToProcess = [];
  const isDirect = directItems && Array.isArray(directItems) && directItems.length > 0;
  
  if (isDirect) {
    itemsToProcess = directItems;
  } else {
    itemsToProcess = carts.get(userId) || [];
  }

  if (itemsToProcess.length === 0) {
    return res.status(400).json({ error: 'Cannot checkout with no items' });
  }

  // Calculate order items & resolve stock
  const orderItems = [];
  let totalOrderAmount = 0;

  for (const item of itemsToProcess) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}. Stock: ${product.stock}, Requested: ${item.quantity}` });
    }

    // Deduct stock
    product.stock -= item.quantity;

    orderItems.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      pricePaid: product.price,
      image: product.image
    });

    totalOrderAmount += product.price * item.quantity;
  }

  const newOrder: Order = {
    id: `#TB-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    items: orderItems,
    total: totalOrderAmount,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'PROCESSING',
    address: address
  };

  // Record order
  const userOrders = orders.get(userId) || [];
  userOrders.unshift(newOrder); // Add to beginning
  orders.set(userId, userOrders);

  // Clear user cart if not direct checkout
  if (!isDirect) {
    carts.set(userId, []);
  }

  res.status(201).json(newOrder);
});

// GET /orders/my
app.get('/api/orders/my', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const userOrders = orders.get(userId) || [];
  res.json(userOrders);
});

// GET current user specs
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  const { passwordHash, ...userResponse } = user;
  res.json(userResponse);
});

// Start listening or load Vite
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ToyBox Full-Stack Backend] Listening on port ${PORT}`);
  });
}

startServer();
