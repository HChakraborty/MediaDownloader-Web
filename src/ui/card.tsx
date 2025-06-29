import * as React from "react";
import cn from "@/utils/tailwindMerge";

const Card: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-4 sm:py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
};

const CardHeader: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 sm:px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
};

const CardTitle: React.FC<React.ComponentProps<"h2">> = ({
  className,
  ...props
}) => {
  return (
    <h2
      data-slot="card-title"
      className={cn(
        "leading-none font-semibold text-base sm:text-lg",
        className
      )}
      {...props}
    />
  );
};

const CardDescription: React.FC<React.ComponentProps<"p">> = ({
  className,
  ...props
}) => {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

const CardAction: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
};

const CardContent: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 sm:px-6", className)}
      {...props}
    />
  );
};

const CardFooter: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-4 sm:px-6 [.border-t]:pt-6",
        className
      )}
      {...props}
    />
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
