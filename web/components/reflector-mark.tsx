type ReflectorMarkProps = {
  className?: string;
  spin?: boolean;
};

export function ReflectorMark({ className = "h-9 w-9", spin }: ReflectorMarkProps) {
  return (
    // Official mark from reflector.network (night-theme wordmark companion)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://reflector.network/images/logo-white.svg"
      alt=""
      width={36}
      height={36}
      className={`${className}${spin ? " rf-mark" : ""}`}
    />
  );
}
