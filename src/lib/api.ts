const API_BASE = 'https://functions.poehali.dev';

export const authApi = {
  login: async (phone: string, name: string) => {
    const response = await fetch(`${API_BASE}/37c573b7-7098-4e29-8be3-b94c11b782e0`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name }),
    });
    return response.json();
  },
  
  getUser: async (userId: number) => {
    const response = await fetch(`${API_BASE}/37c573b7-7098-4e29-8be3-b94c11b782e0?userId=${userId}`);
    return response.json();
  },
};

export const ordersApi = {
  create: async (orderData: any) => {
    const response = await fetch(`${API_BASE}/70817ba9-1835-434e-aeb2-c6b286d022e2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },
  
  getAll: async () => {
    const response = await fetch(`${API_BASE}/70817ba9-1835-434e-aeb2-c6b286d022e2`);
    return response.json();
  },
  
  getByUser: async (userId: number) => {
    const response = await fetch(`${API_BASE}/70817ba9-1835-434e-aeb2-c6b286d022e2?userId=${userId}`);
    return response.json();
  },
  
  updateStatus: async (orderId: number, status: string) => {
    const response = await fetch(`${API_BASE}/70817ba9-1835-434e-aeb2-c6b286d022e2`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    return response.json();
  },
};
