import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Join a room for a specific order
  @SubscribeMessage('joinOrder')
  handleJoinOrder(client: Socket, orderId: string) {
    client.join(orderId);
    console.log(`Client ${client.id} joined order room: ${orderId}`);
  }

  // Simulate Cashier ACC (Accepting the order)
  @SubscribeMessage('confirmOrder')
  handleConfirmOrder(client: Socket, orderId: string) {
    console.log(`Order ${orderId} confirmed by cashier`);
    this.server.to(orderId).emit('orderStatusChanged', {
      orderId,
      status: 'CONFIRMED',
      message: 'Pesanan sudah dikonfirmasi! Mohon menunggu.',
    });
  }
}
