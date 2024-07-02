import eventlet
eventlet.monkey_patch()

import json
from flask import Flask, render_template, url_for
from flask_socketio import SocketIO
import time

import websocket

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, async_mode='eventlet')

BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/btcusdt@trade"

def binance_ws():
    ws = websocket.create_connection(BINANCE_WS_URL)
    last_emit_time = 0  # Initialize the last emitted time
    while True:
        try:
            data = ws.recv()
            trade_data = json.loads(data)
            price = trade_data['p']
            volume = trade_data['q']
            time = trade_data['E']
            #print(f"Time: {time}, Price: {price}, Volume: {volume}")
            #socketio.emit('btc_quote', {'time': time, 'price': price, 'volume': volume})

            # Emit data every second
            current_time = int(time / 1000)  # Convert to seconds

            if current_time > last_emit_time:
                last_emit_time = current_time
                print(f"Time: {time}, Price: {price}, Volume: {volume}")
                socketio.emit('btc_quote', {'time': time, 'price': price, 'volume': volume})
            

        except Exception as e:
            print(f"Error in WebSocket connection: {e}")
            break
    ws.close()

@app.route('/')
def principal():

    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

def run_websocket():
    eventlet.spawn(binance_ws)

if __name__ == '__main__':
    run_websocket()
    socketio.run(app, host='0.0.0.0', port=8082)