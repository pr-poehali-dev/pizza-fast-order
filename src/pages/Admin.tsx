import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  user_id: number;
  total_price: number;
  bonus_used: number;
  status: string;
  delivery_address: string;
  phone: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  preparing: 'bg-yellow-500',
  delivery: 'bg-purple-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusNames: Record<string, string> = {
  new: 'Новый',
  preparing: 'Готовится',
  delivery: 'Доставка',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заказы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({
        title: 'Успешно',
        description: 'Статус заказа обновлен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };
  
  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivery: orders.filter(o => o.status === 'delivery').length,
    revenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total_price, 0),
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-xl font-bold gradient-text">Админ-панель</h1>
          <Button variant="ghost" onClick={loadOrders}>
            <Icon name="RefreshCw" size={20} />
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего заказов</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Icon name="ShoppingBag" size={40} className="text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Новые</p>
                <p className="text-3xl font-bold text-blue-500">{stats.new}</p>
              </div>
              <Icon name="Bell" size={40} className="text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">В работе</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.preparing + stats.delivery}</p>
              </div>
              <Icon name="Truck" size={40} className="text-yellow-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Выручка</p>
                <p className="text-3xl font-bold text-green-500">{stats.revenue.toLocaleString()} ₽</p>
              </div>
              <Icon name="DollarSign" size={40} className="text-green-500" />
            </div>
          </Card>
        </div>
        
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Заказы</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader2" size={48} className="mx-auto animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Заказов пока нет</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Адрес</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-semibold">#{order.id}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleString('ru-RU')}</TableCell>
                        <TableCell>{order.phone}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.delivery_address}</TableCell>
                        <TableCell className="font-bold">{order.total_price} ₽</TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[order.status]} text-white border-0`}>
                            {statusNames[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Новый</SelectItem>
                              <SelectItem value="preparing">Готовится</SelectItem>
                              <SelectItem value="delivery">Доставка</SelectItem>
                              <SelectItem value="completed">Завершен</SelectItem>
                              <SelectItem value="cancelled">Отменен</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
