import { ComponentProps, FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends ComponentProps<'div'> {
  full?: boolean;
}

export const Container: FC<Props> = ({ className, full = false, ...props }) => {
  return (
    <div
      className={twMerge(`mx-auto w-full px-[32px] ${full ? '' : 'max-w-[1184px]'}`, className)}
      {...props}
    />
  );
};
