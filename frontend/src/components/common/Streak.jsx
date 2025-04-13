import { useEffect, useState } from "react";
import { useAuth } from "../../context/authProvider";
import { Flame, CircleDashed, Recycle } from "lucide-react";
import { useSocket } from "../../context/socket.io/socketContext";
import { getIsoDate } from "../../services/formatDate";
import { SOCKETEVENTENUM } from "../../../contants";
import { updateStreaks } from "../../services";

const Streak = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [streaks, setSreaks] = useState(null);
  const [isUpdating, setUpdating] = useState(false);

  // useEffect(() => {
  //   const updateStreaksCount = async () => {
  //     try {
  //       const response = await getStreaks(user._id);
  //       if(response.success) {
  //         localStorage.setItem("user", JSON.stringify(response.data));
  //         setUpdating(false);
  //       }

  //    } catch (e) {
  //     console.log(e)
  //    }
  //    }
  //   updateStreaksCount();
  // }, []);

  useEffect(() => {
try {
  socket.on(SOCKETEVENTENUM.UPDATE_USER_STREAK, (newUser) => {
    console.log(newUser)
    localStorage.setItem("user", JSON.stringify(newUser));
    setSreaks(newUser.streaks.current);
  });


} catch (e) {
  console.log(e.message)
  
}

    return () => {
      socket.off(SOCKETEVENTENUM.UPDATE_USER_STREAK);
    };
  }, [socket]);
  return (
    <div className="flex items-center gap-1">
      <div
        className={`flex aspect-square w-6 items-center justify-center rounded-full ${!isUpdating && "bg-rose-500"}`}
      >
        {isUpdating ? (
          <CircleDashed className="text-rose-500" size={24} />
        ) : (
          <Flame size={24} fill="dark:bg-gray-700 bg-white " strokeWidth={0} />
        )}
      </div>
      <span className="text-[1rem] font-medium text-rose-500">
        {streaks || user.streaks.current}
      </span>
    </div>
  );
};

export default Streak;
