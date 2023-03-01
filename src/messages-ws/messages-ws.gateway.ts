import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    this.server.emit('clients-updated', this.messagesWsService.connectedClientsCount());
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.unregisterClient(client);
    this.server.emit('clients-updated', this.messagesWsService.connectedClientsCount());
  }
}
