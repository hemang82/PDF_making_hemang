import type { JSX, ReactNode } from 'react';

type MyContainerProps = {
  children: ReactNode;
  className?: string;
};

const MyContainer = ({ children, className }: MyContainerProps): JSX.Element => {
  return <div className={`max-w-container mx-auto px-8 xl:px-0 ${className || ''}`}>{children}</div>;
};

export default MyContainer;
