import { ComponentProps, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Header } from './Header';

interface Props extends ComponentProps<'div'> {
  contentClassName?: string;
}

export const Page: FC<Props> = ({ className, contentClassName, children, ...props }) => {
  return (
    <div
      className={twMerge('flex min-w-[1440px] grow flex-col [--header-height:100px]', className)}
      {...props}
    >
      <Header className="shrink-0" />
      <div className={twMerge('shrink-0 grow', contentClassName)}>{children}</div>
    </div>
  );
};
