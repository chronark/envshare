import React, { PropsWithChildren } from "react";

export const Title: React.FC<PropsWithChildren> = ({ children }): JSX.Element => {
  return (
    <h1 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text py-4 text-center text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
      {children}
    </h1>
  );
};
