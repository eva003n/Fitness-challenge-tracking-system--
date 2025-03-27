import { Bell } from "lucide-react";
import { useSocket } from "../../context/socket.io/socketContext";
import { useEffect, useState } from "react";
import { SOCKETEVENTENUM } from "../../../../backend/src/constants";
import { useAuth } from "../../context/authProvider";

const Notify = () => {
  const { notifications } = useSocket();
  const [unRead, setUnRead] = useState(() => {
    return JSON.parse(localStorage.getItem("UnreadNotifications")) || 0;
  });
useEffect(() => {
  const unseen =  notifications.reduce((acc, data) => {
    if (!data.seen) {
      return acc + 1;
    }
    return acc;
  }, 0);
  localStorage.setItem("UnreadNotifications", unseen)
  setUnRead(unseen);
}, [notifications]);

  return (
    <div className="relative flex items-center">
      {unRead > 0 && (
        <div className="absolute -right-1 -top-2 flex aspect-square w-4 items-center justify-center rounded-full bg-violet-600 text-[10px]">
          {unRead > 0 ? `${unRead}+` : unRead}
        </div>
      )}
      <button >
        <Bell size={20} strokeWidth={2} strokeOpacity={0.7} />
      </button>
    </div>
  );
};

export default Notify;
