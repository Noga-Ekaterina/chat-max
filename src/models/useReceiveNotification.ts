import { useEffect, useEffectEvent } from "react";
import { useRequest } from "../hooks/useRequest";
import type { Credentials } from "../types/credentials";

type NotificationBody = {
  typeWebhook: string;
  idMessage?: string;
  timestamp?: number;
  senderData?: { chatId: string };
  messageData?: {
    textMessageData?: { textMessage: string };
    extendedTextMessageData?: { text: string };
  };
};

type ReceiveNotificationOptions = Credentials & {
  chatId: string;
  onMessageReceived: (message: { id: string; text: string; timestamp: number }) => void;
};

export const useReceiveNotification = ({ idInstance, apiTokenInstance, chatId, onMessageReceived }: ReceiveNotificationOptions) => {
  const { request, error } = useRequest();
  const handleNotification = useEffectEvent((body: NotificationBody) => {
    if (body.typeWebhook !== "incomingMessageReceived" || body.senderData?.chatId !== chatId) return;

    const text = body.messageData?.textMessageData?.textMessage
      ?? body.messageData?.extendedTextMessageData?.text;
    if (!body.idMessage || typeof text !== "string") return;

    onMessageReceived({
      id: body.idMessage,
      text,
      timestamp: body.timestamp ?? Date.now() / 1000,
    });
  });

  useEffect(() => {
    let stop = false;
    const controller = new AbortController();
    const token = encodeURIComponent(apiTokenInstance);

    (async () => {
      while (!stop) {
        try {
          const notification = await request<{ receiptId: number; body: NotificationBody } | null>(
            `/waInstance${idInstance}/receiveNotification/${token}?receiveTimeout=14`,
            {
              method: "GET",
              cache: "no-store",
              signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
              credentials: "omit",
              referrerPolicy: "no-referrer",
            },
          );

          if (stop || !notification) continue;

          handleNotification(notification.body);

          await request(
            `/waInstance${idInstance}/deleteNotification/${token}/${notification.receiptId}`,
            {
              method: "DELETE",
              signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
              credentials: "omit",
              referrerPolicy: "no-referrer",
            },
          );
        } catch {
          if (stop) break;
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    })();
  
    return () => {
      stop = true;
      controller.abort();
    };
  }, [idInstance, apiTokenInstance, request]);

  return { error };
}
