import { NotificationDto } from './notificacion-dto';

export class HistorialNotificacionDto {
  usuario: string;
  idDenuncia: string;
  notification: NotificationDto;
  data?: {
    [key: string]: string;
  };
  createdAt: Date;
}
