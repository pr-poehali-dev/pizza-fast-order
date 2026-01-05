import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Ingredient {
  id: number;
  name: string;
  price: number;
  category: 'sauce' | 'cheese' | 'meat' | 'veggie';
}

const ingredients: Ingredient[] = [
  { id: 1, name: 'Томатный соус', price: 0, category: 'sauce' },
  { id: 2, name: 'Сливочный соус', price: 50, category: 'sauce' },
  { id: 3, name: 'Моцарелла', price: 80, category: 'cheese' },
  { id: 4, name: 'Чеддер', price: 90, category: 'cheese' },
  { id: 5, name: 'Пармезан', price: 100, category: 'cheese' },
  { id: 6, name: 'Пепперони', price: 120, category: 'meat' },
  { id: 7, name: 'Ветчина', price: 100, category: 'meat' },
  { id: 8, name: 'Курица', price: 110, category: 'meat' },
  { id: 9, name: 'Бекон', price: 130, category: 'meat' },
  { id: 10, name: 'Томаты', price: 50, category: 'veggie' },
  { id: 11, name: 'Грибы', price: 60, category: 'veggie' },
  { id: 12, name: 'Лук', price: 40, category: 'veggie' },
  { id: 13, name: 'Перец', price: 50, category: 'veggie' },
  { id: 14, name: 'Оливки', price: 70, category: 'veggie' },
];

export default function Constructor() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<25 | 30>(25);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([1, 3]);
  
  const basePrice = selectedSize === 25 ? 300 : 500;
  
  const toggleIngredient = (id: number) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const totalPrice = basePrice + 
    ingredients
      .filter(ing => selectedIngredients.includes(ing.id))
      .reduce((sum, ing) => sum + ing.price, 0);
  
  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      sauce: 'Соусы',
      cheese: 'Сыры',
      meat: 'Мясо',
      veggie: 'Овощи'
    };
    return names[category];
  };
  
  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-xl font-bold gradient-text">Конструктор пиццы</h1>
          <div className="w-20"></div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Выберите размер</h3>
              <RadioGroup value={selectedSize.toString()} onValueChange={(v) => setSelectedSize(Number(v) as 25 | 30)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="25" id="size-25" />
                  <Label htmlFor="size-25" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>25 см</span>
                      <span className="font-bold">300 ₽</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="30" id="size-30" />
                  <Label htmlFor="size-30" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>30 см</span>
                      <span className="font-bold">500 ₽</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </Card>
            
            {Object.entries(groupedIngredients).map(([category, items]) => (
              <Card key={category} className="p-6">
                <h3 className="font-bold text-lg mb-4">{getCategoryName(category)}</h3>
                <div className="space-y-2">
                  {items.map(ingredient => (
                    <div 
                      key={ingredient.id}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => toggleIngredient(ingredient.id)}
                    >
                      <Checkbox 
                        id={`ing-${ingredient.id}`}
                        checked={selectedIngredients.includes(ingredient.id)}
                        onCheckedChange={() => toggleIngredient(ingredient.id)}
                      />
                      <Label htmlFor={`ing-${ingredient.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>{ingredient.name}</span>
                          <span className="font-bold">
                            {ingredient.price === 0 ? 'Бесплатно' : `+${ingredient.price} ₽`}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="md:sticky md:top-24 h-fit">
            <Card className="p-6">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-full flex items-center justify-center mb-6">
                <Icon name="Pizza" size={120} className="text-orange-500" />
              </div>
              
              <h3 className="font-bold text-xl mb-4">Ваша пицца</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Размер:</span>
                  <span className="font-semibold">{selectedSize} см</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ингредиентов:</span>
                  <span className="font-semibold">{selectedIngredients.length}</span>
                </div>
              </div>
              
              <div className="space-y-1 mb-6 max-h-40 overflow-y-auto">
                {ingredients
                  .filter(ing => selectedIngredients.includes(ing.id))
                  .map(ing => (
                    <div key={ing.id} className="flex items-center justify-between text-sm">
                      <span>{ing.name}</span>
                      <span className="text-muted-foreground">
                        {ing.price === 0 ? '' : `+${ing.price} ₽`}
                      </span>
                    </div>
                  ))}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>Итого:</span>
                  <span className="gradient-text">{totalPrice} ₽</span>
                </div>
              </div>
              
              <Button className="w-full gradient-bg text-white text-lg py-6 hover:opacity-90">
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Добавить в корзину
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
