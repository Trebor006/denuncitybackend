import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MyGateway {
  @WebSocketServer()
  server: Server;

  emitInsertEvent(data: any) {
    this.server.emit('nuevaDenuncia', data);
  }
}
