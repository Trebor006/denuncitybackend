import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async sendNotification(deviceToken: string, title: string, body: string) {
    const message = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
    };

    try {
      const response = await this.firebase.messaging.send(message);
      console.log('Notificación enviada con éxito.');
      console.log(response);
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
    }
  }
}
