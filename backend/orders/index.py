import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления заказами'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId')
            items = body.get('items', [])
            total_price = body.get('totalPrice', 0)
            bonus_used = body.get('bonusUsed', 0)
            delivery_address = body.get('deliveryAddress', '')
            phone = body.get('phone', '')
            
            if not items or not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Товары и телефон обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "INSERT INTO orders (user_id, total_price, bonus_used, delivery_address, phone) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (user_id, total_price, bonus_used, delivery_address, phone)
            )
            order_id = cur.fetchone()['id']
            
            for item in items:
                cur.execute(
                    "INSERT INTO order_items (order_id, product_id, product_name, selected_size, quantity, price) VALUES (%s, %s, %s, %s, %s, %s)",
                    (order_id, item.get('id'), item.get('name'), item.get('selectedSize'), item.get('quantity'), item.get('price'))
                )
            
            if user_id and bonus_used > 0:
                cur.execute(
                    "UPDATE users SET bonus_balance = bonus_balance - %s WHERE id = %s",
                    (bonus_used, user_id)
                )
            
            if user_id:
                bonus_earned = int(total_price * 0.05)
                cur.execute(
                    "UPDATE users SET bonus_balance = bonus_balance + %s WHERE id = %s",
                    (bonus_earned, user_id)
                )
            
            conn.commit()
            
            cur.execute(
                "SELECT * FROM orders WHERE id = %s",
                (order_id,)
            )
            order = cur.fetchone()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(order), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('userId')
            order_id = query_params.get('orderId')
            
            if order_id:
                cur.execute(
                    "SELECT * FROM orders WHERE id = %s",
                    (order_id,)
                )
                order = cur.fetchone()
                
                if not order:
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заказ не найден'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT * FROM order_items WHERE order_id = %s",
                    (order_id,)
                )
                items = cur.fetchall()
                
                result = dict(order)
                result['items'] = [dict(item) for item in items]
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
            
            elif user_id:
                cur.execute(
                    "SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC",
                    (user_id,)
                )
                orders = cur.fetchall()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(order) for order in orders], default=str),
                    'isBase64Encoded': False
                }
            
            else:
                cur.execute("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100")
                orders = cur.fetchall()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(order) for order in orders], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            order_id = body.get('orderId')
            status = body.get('status')
            
            if not order_id or not status:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'orderId и status обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE orders SET status = %s, updated_at = %s WHERE id = %s RETURNING *",
                (status, datetime.now(), order_id)
            )
            order = cur.fetchone()
            conn.commit()
            
            cur.close()
            conn.close()
            
            if not order:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заказ не найден'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(order), default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
