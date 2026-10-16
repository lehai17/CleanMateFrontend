import { Ui } from './../ui/Preferences';
import { Link } from './../ui/Links';
import { useNotifications } from "../context/NotificationContext";

export default function NotificationLink() {
  const { unreadCount } = useNotifications();
  return <Link to="/notifications" aria-label="Thông báo" className="relative flex items-center gap-1 text-emerald-800">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </svg>
    <Ui as="span" className="hidden xl:inline">Thông báo</Ui>
    {unreadCount > 0 && <Ui as="span" data-testid="notification-unread-count" className="rounded-full bg-red-600 px-1.5 text-xs text-white">{unreadCount > 99 ? "99+" : unreadCount}</Ui>}
  </Link>;
}
