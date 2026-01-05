import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';

interface Product {
  id: number;
  name: string;
  category: 'pizza' | 'snack' | 'drink';
  price25?: number;
  price30?: number;
  price?: number;
  image: string;
  description: string;
  popular?: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: 25 | 30;
}

const products: Product[] = [
  { id: 1, name: 'Маргарита', category: 'pizza', price25: 450, price30: 650, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', description: 'Томаты, моцарелла, базилик', popular: true },
  { id: 2, name: 'Пепперони', category: 'pizza', price25: 520, price30: 720, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', description: 'Пепперони, моцарелла, томатный соус' },
  { id: 3, name: '4 Сыра', category: 'pizza', price25: 580, price30: 780, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', description: 'Моцарелла, чеддер, пармезан, дор блю', popular: true },
  { id: 4, name: 'Гавайская', category: 'pizza', price25: 490, price30: 690, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', description: 'Курица, ананасы, моцарелла' },
  { id: 5, name: 'Мясная', category: 'pizza', price25: 620, price30: 850, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', description: 'Говядина, свинина, курица, бекон' },
  { id: 6, name: 'Вегетарианская', category: 'pizza', price25: 480, price30: 680, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', description: 'Перец, томаты, грибы, оливки' },
  { id: 7, name: 'Барбекю', category: 'pizza', price25: 550, price30: 750, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', description: 'Курица, соус барбекю, лук, бекон' },
  { id: 8, name: 'Морская', category: 'pizza', price25: 680, price30: 920, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', description: 'Креветки, кальмары, мидии, лосось' },
  { id: 9, name: 'Мексиканская', category: 'pizza', price25: 540, price30: 740, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', description: 'Острая говядина, халапеньо, кукуруза' },
  { id: 10, name: 'Цезарь', category: 'pizza', price25: 590, price30: 790, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', description: 'Курица, салат айсберг, пармезан, соус цезарь' },
  { id: 11, name: 'Карбонара', category: 'pizza', price25: 570, price30: 770, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', description: 'Бекон, сливочный соус, пармезан, яйцо' },
  { id: 12, name: 'Дьябло', category: 'pizza', price25: 560, price30: 760, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', description: 'Острая салями, халапеньо, чили' },
  { id: 13, name: 'Трюфельная', category: 'pizza', price25: 750, price30: 980, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', description: 'Трюфельное масло, белые грибы, пармезан', popular: true },
  
  { id: 14, name: 'Куриные крылышки BBQ', category: 'snack', price: 320, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', description: '8 шт, соус барбекю' },
  { id: 15, name: 'Картофель фри', category: 'snack', price: 180, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', description: 'Хрустящий картофель с соусом' },
  { id: 16, name: 'Сырные палочки', category: 'snack', price: 250, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', description: '6 шт, сырный соус' },
  { id: 17, name: 'Наггетсы', category: 'snack', price: 280, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', description: '10 шт, соус на выбор' },
  
  { id: 18, name: 'Лимонад классический', category: 'drink', price: 150, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', description: '0.5л, домашний' },
  { id: 19, name: 'Лимонад малиновый', category: 'drink', price: 160, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', description: '0.5л, с малиной' },
  { id: 20, name: 'Лимонад манго-маракуйя', category: 'drink', price: 170, image: 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', description: '0.5л, тропический' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pizza' | 'snack' | 'drink'>('all');
  const [bonusBalance] = useState(250);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const addToCart = (product: Product, size?: 25 | 30) => {
    const existingItem = cart.find(
      item => item.id === product.id && item.selectedSize === size
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedSize: size }]);
    }
  };

  const removeFromCart = (id: number, size?: 25 | 30) => {
    setCart(cart.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: number, quantity: number, size?: 25 | 30) => {
    if (quantity === 0) {
      removeFromCart(id, size);
    } else {
      setCart(cart.map(item =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getItemPrice = (item: CartItem): number => {
    if (item.category === 'pizza' && item.selectedSize) {
      return item.selectedSize === 25 ? item.price25! : item.price30!;
    }
    return item.price!;
  };

  const totalPrice = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <Icon name="Pizza" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Пицца мчится</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Sun" size={18} />
              <Switch checked={isDark} onCheckedChange={setIsDark} />
              <Icon name="Moon" size={18} />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="relative gradient-bg text-white hover:opacity-90">
                  <Icon name="ShoppingCart" size={20} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <Card key={`${item.id}-${item.selectedSize}`} className="p-4">
                          <div className="flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              {item.selectedSize && (
                                <p className="text-sm text-muted-foreground">{item.selectedSize} см</p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}>
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}>
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                </div>
                                <span className="font-bold">{getItemPrice(item) * item.quantity} ₽</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}

                      <Card className="p-4 gradient-secondary-bg text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span>Бонусный баланс:</span>
                          <span className="font-bold">{bonusBalance} ₽</span>
                        </div>
                        <div className="flex items-center justify-between text-xl font-bold">
                          <span>Итого:</span>
                          <span>{totalPrice} ₽</span>
                        </div>
                      </Card>

                      <Button className="w-full gradient-bg text-white text-lg py-6 hover:opacity-90">
                        Оформить заказ
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4 gradient-bg text-white border-0">
            <Icon name="Zap" size={14} className="mr-1" />
            Скидка 20% на первый заказ
          </Badge>
          <h2 className="text-5xl md:text-7xl font-bold gradient-text mb-4 animate-fade-in">
            Пицца мчится к вам!
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Доставка за 30 минут или пицца в подарок 🚀
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gradient-bg text-white hover:opacity-90">
              <Icon name="Pizza" size={20} className="mr-2" />
              Выбрать пиццу
            </Button>
            <Button size="lg" variant="outline">
              <Icon name="Sparkles" size={20} className="mr-2" />
              Конструктор пиццы
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="all">Всё</TabsTrigger>
            <TabsTrigger value="pizza">Пиццы</TabsTrigger>
            <TabsTrigger value="snack">Закуски</TabsTrigger>
            <TabsTrigger value="drink">Напитки</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover-scale group">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {product.popular && (
                      <Badge className="absolute top-2 right-2 gradient-bg text-white border-0">
                        <Icon name="TrendingUp" size={12} className="mr-1" />
                        Хит
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    
                    {product.category === 'pizza' ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">25 см</span>
                          <Button 
                            size="sm" 
                            className="gradient-bg text-white hover:opacity-90"
                            onClick={() => addToCart(product, 25)}
                          >
                            {product.price25} ₽
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">30 см</span>
                          <Button 
                            size="sm" 
                            className="gradient-bg text-white hover:opacity-90"
                            onClick={() => addToCart(product, 30)}
                          >
                            {product.price30} ₽
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">{product.price} ₽</span>
                        <Button 
                          className="gradient-bg text-white hover:opacity-90"
                          onClick={() => addToCart(product)}
                        >
                          <Icon name="Plus" size={18} />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 Пицца мчится. Доставляем счастье каждый день 🍕</p>
          </div>
        </div>
      </footer>
    </div>
  );
}