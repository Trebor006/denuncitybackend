import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { InjectModel } from '@nestjs/mongoose';
import { Notificaciones } from '../schemas/notificaciones.schema';
import { Model } from 'mongoose';
import { HistorialNotificacionDto } from '../common/dto/HistorialNotificacionDto';
import { NotificationDto } from '../common/dto/notificacion-dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @InjectModel(Notificaciones.name)
    private notificacionesModel: Model<Notificaciones>,
  ) {}

  async sendNotification(
    deviceTokens: string[],
    title: string,
    body: string,
    data: string,
    imageUrl: string,
    hash: string,
    usuario: string,
  ) {
    const message: MulticastMessage = {
      notification: {
        title,
        body,
        imageUrl,
      },
      data: {
        data,
      },
      tokens: deviceTokens,
    };

    try {
      const response = await this.firebase.messaging.sendEachForMulticast(
        message,
      );
      console.log('Notificación enviada con éxito.');
      console.log(response);
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
    }

    this.guardarNotificacion(title, body, data, imageUrl, hash, usuario);
  }

  async guardarNotificacion(
    title: string,
    body: string,
    data: string,
    imageUrl: string,
    hash: string,
    usuario: string,
  ) {
    let notificacion = new NotificationDto();
    notificacion.body = body;
    notificacion.title = title;
    notificacion.imageUrl = imageUrl;

    let historialNotificacionDto = new HistorialNotificacionDto();
    historialNotificacionDto.usuario = usuario;
    historialNotificacionDto.idDenuncia = hash;
    historialNotificacionDto.notification = notificacion;
    historialNotificacionDto.data = {
      data,
    };

    historialNotificacionDto.createdAt = new Date();

    const newHistorialNotificacion = new this.notificacionesModel(
      historialNotificacionDto,
    );
    newHistorialNotificacion.save();
  }
}
