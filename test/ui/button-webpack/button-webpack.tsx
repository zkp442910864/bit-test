import type { ReactNode } from 'react';

export type ButtonWebpackProps = {
  /**
   * sets the component children.
   */
  children?: ReactNode;
};

export function ButtonWebpack({ children }: ButtonWebpackProps) {
  return (
    <div>
      {children}
    </div>
  );
}
