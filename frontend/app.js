class VirtualStore {
    constructor() {
        this.users = [];
        this.products = [];
        this.cart = [];
        this.currentUser = null;
        this.nextUserId = 1;
        this.nextProductId = 1;
        this.currentView = 'products';
        
        this.initializeDefaultData();
        this.bindEvents();
        this.updateUI();
    }

    initializeDefaultData() {
        // Usuario administrador por defecto
        this.users.push({
            id: this.nextUserId++,
            name: "Admin",
            email: "admin@tienda.com",
            password: "admin123",
            isAdmin: true
        });

        // Productos por defecto con URLs de imágenes de ejemplo
        const defaultProducts = [
            {
                id: this.nextProductId++,
                name: "iPhone 15 Pro",
                description: "El último smartphone de Apple con chip A17 Pro y cámara de 48MP",
                price: 4500000,
                image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
            },
            {
                id: this.nextProductId++,
                name: "MacBook Air M3",
                description: "Laptop ultradelgada con el nuevo chip M3 de Apple",
                price: 5800000,
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
            },
            {
                id: this.nextProductId++,
                name: "AirPods Pro",
                description: "Auriculares inalámbricos con cancelación activa de ruido",
                price: 980000,
                image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop"
            },
            {
                id: this.nextProductId++,
                name: "Apple Watch Series 9",
                description: "Reloj inteligente con GPS y monitoreo de salud avanzado",
                price: 1650000,
                image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop"
            },
            {
                id: this.nextProductId++,
                name: "iPad Pro",
                description: "Tablet profesional con chip M2 y pantalla Liquid Retina",
                price: 4200000,
                image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop"
            },
            {
                id: this.nextProductId++,
                name: "Samsung Galaxy S24",
                description: "Smartphone Android con cámara de 200MP y pantalla Dynamic AMOLED",
                price: 3800000,
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop"
            }
        ];

        this.products = defaultProducts;
    }

    bindEvents() {
        // Eventos de autenticación
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        document.getElementById('registerBtn').addEventListener('click', () => this.register());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('showRegisterBtn').addEventListener('click', () => this.showRegisterForm());
        document.getElementById('showLoginBtn').addEventListener('click', () => this.showLoginForm());

        // Eventos de productos
        document.getElementById('addProductBtn').addEventListener('click', () => this.addProduct());

        // Eventos de carrito
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
        document.getElementById('clearCartBtn').addEventListener('click', () => this.clearCart());
        document.getElementById('cartToggle').addEventListener('click', () => this.showCart());

        // Eventos de navegación
        document.getElementById('showProducts').addEventListener('click', () => this.showProducts());
        document.getElementById('showCart').addEventListener('click', () => this.showCart());

        // Eventos de Enter en formularios
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
        document.getElementById('registerPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.register();
        });
    }

    // Métodos de navegación
    showProducts() {
        this.currentView = 'products';
        document.getElementById('storeSection').classList.remove('hidden');
        document.getElementById('cartSection').classList.add('hidden');
        document.getElementById('showProducts').classList.add('active');
        document.getElementById('showCart').classList.remove('active');
    }

    showCart() {
        this.currentView = 'cart';
        document.getElementById('storeSection').classList.add('hidden');
        document.getElementById('cartSection').classList.remove('hidden');
        document.getElementById('showProducts').classList.remove('active');
        document.getElementById('showCart').classList.add('active');
        this.renderCart();
    }

    // Métodos de autenticación
    showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        this.clearMessages();
    }

    showLoginForm() {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        this.clearMessages();
    }

    clearMessages() {
        document.getElementById('loginError').textContent = '';
        document.getElementById('registerError').textContent = '';
        document.getElementById('registerSuccess').textContent = '';
        document.getElementById('productSuccess').textContent = '';
    }

    register() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        if (!name || !email || !password) {
            document.getElementById('registerError').textContent = 'Todos los campos son obligatorios';
            return;
        }

        if (password.length < 6) {
            document.getElementById('registerError').textContent = 'La contraseña debe tener al menos 6 caracteres';
            return;
        }

        if (this.users.find(user => user.email === email)) {
            document.getElementById('registerError').textContent = 'Este email ya está registrado';
            return;
        }

        const newUser = {
            id: this.nextUserId++,
            name,
            email,
            password,
            isAdmin: false
        };

        this.users.push(newUser);
        document.getElementById('registerSuccess').textContent = '¡Registro exitoso! Ya puedes iniciar sesión';
        document.getElementById('registerError').textContent = '';
        
        // Limpiar formulario
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
    }

    login() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            document.getElementById('loginError').textContent = 'Email y contraseña son obligatorios';
            return;
        }

        const user = this.users.find(u => u.email === email && u.password === password);

        if (!user) {
            document.getElementById('loginError').textContent = 'Email o contraseña incorrectos';
            return;
        }

        this.currentUser = user;
        this.updateUI();
        
        // Limpiar formulario
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    }

    logout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            this.currentUser = null;
            this.cart = [];
            this.currentView = 'products';
            this.updateUI();
        }
    }

    // Métodos de productos
    addProduct() {
        if (!this.currentUser || !this.currentUser.isAdmin) {
            return;
        }

        const name = document.getElementById('productName').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const price = parseInt(document.getElementById('productPrice').value);
        const image = document.getElementById('productImage').value.trim() || 'https://via.placeholder.com/400x400/f8f9fa/6c757d?text=Sin+Imagen';

        if (!name || !description || isNaN(price) || price <= 0) {
            document.getElementById('productSuccess').textContent = '';
            document.getElementById('productSuccess').className = 'error';
            document.getElementById('productSuccess').textContent = 'Todos los campos son obligatorios y el precio debe ser mayor a 0';
            return;
        }

        const newProduct = {
            id: this.nextProductId++,
            name,
            description,
            price,
            image
        };

        this.products.push(newProduct);
        this.renderProducts();

        // Limpiar formulario
        document.getElementById('productName').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productImage').value = '';

        document.getElementById('productSuccess').className = 'success';
        document.getElementById('productSuccess').textContent = '¡Producto agregado exitosamente!';
        
        setTimeout(() => {
            document.getElementById('productSuccess').textContent = '';
        }, 3000);
    }

    deleteProduct(productId) {
        if (!this.currentUser || !this.currentUser.isAdmin) {
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== productId);
            
            // Remover del carrito si existe
            this.cart = this.cart.filter(item => item.product.id !== productId);
            
            this.renderProducts();
            this.renderCart();
        }
    }

    // Métodos del carrito
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.product.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                product: product,
                quantity: 1
            });
        }

        this.updateCartCounter();
        
        // Mostrar feedback visual
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '¡Agregado!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
    }

    removeFromCart(productId) {
        const itemIndex = this.cart.findIndex(item => item.product.id === productId);
        if (itemIndex > -1) {
            if (this.cart[itemIndex].quantity > 1) {
                this.cart[itemIndex].quantity -= 1;
            } else {
                this.cart.splice(itemIndex, 1);
            }
        }
        this.renderCart();
        this.updateCartCounter();
    }

    increaseQuantity(productId) {
        const item = this.cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity += 1;
            this.renderCart();
            this.updateCartCounter();
        }
    }

    clearCart() {
        if (this.cart.length === 0) {
            alert('El carrito ya está vacío');
            return;
        }

        if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
            this.cart = [];
            this.renderCart();
            this.updateCartCounter();
        }
    }

    updateCartCounter() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const formattedTotal = this.formatPrice(total);
        
        if (confirm(`¿Confirmar compra por ${formattedTotal}?`)) {
            alert(`¡Compra realizada exitosamente por ${formattedTotal}!\n\nGracias por tu compra, ${this.currentUser.name}.\nRecibirás un email de confirmación pronto.`);
            this.cart = [];
            this.renderCart();
            this.updateCartCounter();
        }
    }

    // Métodos de renderizado
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        if (this.products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6c757d;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📦</div>
                    <h3>No hay productos disponibles</h3>
                    <p>Los productos aparecerán aquí una vez que sean agregados.</p>
                </div>
            `;
            return;
        }

        this.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const isAdmin = this.currentUser && this.currentUser.isAdmin;
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400/f8f9fa/6c757d?text=Sin+Imagen'">
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">${this.formatPrice(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="store.addToCart(${product.id})">
                            Agregar al Carrito
                        </button>
                        ${isAdmin ? `<button class="btn btn-danger" onclick="store.deleteProduct(${product.id})">
                            Eliminar
                        </button>` : ''}
                    </div>
                </div>
            `;
            grid.appendChild(productCard);
        });
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para comenzar tu compra</p>
                </div>
            `;
            cartTotal.textContent = this.formatPrice(0);
            return;
        }

        cartItems.innerHTML = '';
        let totalPrice = 0;

        this.cart.forEach(item => {
            totalPrice += item.product.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}" onerror="this.src='https://via.placeholder.com/80x80/f8f9fa/6c757d?text=Sin+Imagen'">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.product.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.product.price)} c/u</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" onclick="store.removeFromCart(${item.product.id})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="store.increaseQuantity(${item.product.id})">+</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = this.formatPrice(totalPrice);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    updateUI() {
        if (this.currentUser) {
            // Usuario logueado
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('mainNav').classList.remove('hidden');
            document.getElementById('welcomeMessage').classList.remove('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
            document.getElementById('cartToggle').classList.remove('hidden');

            document.getElementById('welcomeMessage').textContent = `¡Hola, ${this.currentUser.name}!`;

            // Mostrar panel de admin si es administrador
            if (this.currentUser.isAdmin) {
                document.getElementById('adminPanel').classList.remove('hidden');
            } else {
                document.getElementById('adminPanel').classList.add('hidden');
            }

            // Mostrar la vista correcta
            if (this.currentView === 'products') {
                this.showProducts();
            } else {
                this.showCart();
            }

            this.renderProducts();
            this.updateCartCounter();
        } else {
            // Usuario no logueado
            document.getElementById('authSection').classList.remove('hidden');
            document.getElementById('storeSection').classList.add('hidden');
            document.getElementById('cartSection').classList.add('hidden');
            document.getElementById('adminPanel').classList.add('hidden');
            document.getElementById('mainNav').classList.add('hidden');
            document.getElementById('welcomeMessage').classList.add('hidden');
            document.getElementById('logoutBtn').classList.add('hidden');
            document.getElementById('cartToggle').classList.add('hidden');
            
            this.showLoginForm();
            this.clearMessages();
        }
    }
}

// Inicializar la tienda
const store = new VirtualStore();