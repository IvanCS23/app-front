import { getInitials } from "@/src/lib/initials";

type UserAvatarProps = {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<UserAvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-16 w-16 text-lg",
};

export default function UserAvatar({ name, avatar, size = "md" }: UserAvatarProps) {
  const classes = sizeClasses[size];

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${classes} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${classes} shrink-0 items-center justify-center rounded-full font-bold text-white`}
      style={{ background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)" }}
    >
      {getInitials(name)}
    </div>
  );
}
