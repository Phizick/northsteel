import styles from "./Avatar.module.scss";
import { useStores } from "../../stores/root-store-context.ts";
import classnames from "classnames";
import { observer } from "mobx-react-lite";

interface AvatarProps {
  className?: string;
}

const Avatar = ({ className = "" }: AvatarProps) => {
  const { userStore } = useStores();

  const setInitials = () => {
    const name = userStore.user?.username;

    if (!name) {
      return "";
    }

    const initials = name?.split(" ").map((word) => word[0].toUpperCase());

    return initials.slice(0, 2).join();
  };

  const avatarClass = classnames({
    [styles.avatar]: true,
    [className]: true,
  });

  return <div className={avatarClass}>{setInitials()}</div>;
};

export default observer(Avatar);
