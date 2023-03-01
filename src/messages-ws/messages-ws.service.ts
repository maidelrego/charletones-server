import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: Socket;
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {}

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  unregisterClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  connectedClientsCount(): string[] {
    return Object.keys(this.connectedClients);
  }
}
