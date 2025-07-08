import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

// Tipos
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Datos en memoria
let users: User[] = [{
  id: 1,
  name: 'Admin',
  email: 'admin@tienda.com',
  password: 'admin123',
  isAdmin: true
}];
let products: Product[] = [];
let carts: Record<string, CartItem[]> = {}; // clave = email

let nextUserId = 2;
let nextProductId = 1;

// App Express
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API

// Registro
app.post('/api/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Campos obligatorios' });

  if (users.find(u => u.email === email))
    return res.status(400).json({ message: 'Este email ya está registrado' });

  const newUser: User = {
    id: nextUserId++,
    name,
    email,
    password,
    isAdmin: false
  };
  users.push(newUser);
  carts[email] = [];
  res.json({ message: 'Registro exitoso' });
});

// Login
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user)
    return res.status(401).json({ message: 'Email o contraseña incorrectos' });
  res.json({ user });
});

// Productos
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(products);
});

app.post('/api/products', (req: Request, res: Response) => {
  const { name, description, price, image } = req.body;
  if (!name || !description || !price)
    return res.status(400).json({ message: 'Datos inválidos' });

  const newProduct: Product = {
    id: nextProductId++,
    name,
    description,
    price,
    image: image || 'https://via.placeholder.com/400x400?text=Sin+Imagen'
  };
  products.push(newProduct);
  res.json({ message: 'Producto agregado', product: newProduct });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  for (const email in carts) {
    carts[email] = carts[email].filter(item => item.product.id !== id);
  }
  res.json({ message: 'Producto eliminado' });
});

// Carrito
app.get('/api/cart/:email', (req: Request, res: Response) => {
  const { email } = req.params;
  res.json(carts[email] || []);
});

app.post('/api/cart/add', (req: Request, res: Response) => {
  const { email, productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const cart = carts[email] || [];
  const existing = cart.find(item => item.product.id === productId);
  if (existing) existing.quantity++;
  else cart.push({ product, quantity: 1 });

  carts[email] = cart;
  res.json({ message: 'Producto agregado al carrito' });
});

app.post('/api/cart/remove', (req: Request, res: Response) => {
  const { email, productId } = req.body;
  const cart = carts[email] || [];
  const idx = cart.findIndex(item => item.product.id === productId);
  if (idx !== -1) {
    if (cart[idx].quantity > 1) cart[idx].quantity--;
    else cart.splice(idx, 1);
  }
  carts[email] = cart;
  res.json({ message: 'Producto eliminado del carrito' });
});

app.post('/api/cart/clear', (req: Request, res: Response) => {
  const { email } = req.body;
  carts[email] = [];
  res.json({ message: 'Carrito vaciado' });
});

app.post('/api/cart/checkout', (req: Request, res: Response) => {
  const { email } = req.body;
  const cart = carts[email] || [];
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  carts[email] = [];
  res.json({ message: 'Compra realizada', total });
});

// Fallback para frontend SPA
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../frontend/inde.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
