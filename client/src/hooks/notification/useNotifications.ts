import { createElement, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/api/notification.api";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import type { Notification } from "@/interfaces/notification.interface";
import { BellRing } from "lucide-react";

export const useNotificationsQuery = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => notificationApi.getNotifications(page, limit),
  });
};

export const useUnreadNotificationCountQuery = () => {
  return useQuery({
    queryKey: ["unreadNotificationCount"],
    queryFn: notificationApi.getUnreadCount,
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};

export const useNotificationSocketListener = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });

      toast.message(notification.title, {
        description: notification.message,
        icon: createElement(BellRing, {
          size: 20,
          strokeWidth: 2.5,
          className: "text-primary",
        }),
      });
    };

    socket.on("notification_received", handleNewNotification);

    return () => {
      socket.off("notification_received", handleNewNotification);
    };
  }, [socket, queryClient]);
};
