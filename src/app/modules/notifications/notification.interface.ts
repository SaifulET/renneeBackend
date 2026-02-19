export interface INotification extends Record<string, unknown> {
  recipient: string;
  sender?: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system' | 'general';
  relatedId?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface INotificationResponse extends Record<string, unknown> {
  _id: string;
  recipient: any;
  sender?: any;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system' | 'general';
  relatedId?: any;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationQuery extends Record<string, unknown> {
  page?: number;
  limit?: number;
  searchTerm?: string;
  type?: string;
  priority?: string;
  isRead?: boolean;
}
