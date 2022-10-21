import { ComponentProps, ComponentRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spin } from './Spin';

interface Props extends Omit<ComponentProps<'button'>, 'type'> {
  type?: 'filled' | 'outline' | 'text' | 'image' | 'unstyled';
  size?: 'sm' | 'md' | 'lg';
  color?: 'black' | 'green' | 'red' | 'gray';
  loading?: boolean;
}

export const Button = forwardRef<ComponentRef<'button'>, Props>(
  (
    {
      className,
      type = 'unstyled',
      size = 'md',
      color = 'black',
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const finalDisabled = loading || disabled;

    let baseClassName = `inline-flex cursor-pointer items-center justify-center bg-transparent px-0 py-0 outline-0 transition-all duration-300 ${
      finalDisabled ? 'cursor-not-allowed' : ''
    }`;

    switch (type) {
      case 'filled':
      case 'outline':
      case 'text':
        baseClassName += ` font-semibold ${finalDisabled ? 'opacity-30' : 'hover:opacity-75'}`;
        break;
      case 'image':
        baseClassName += ` ${finalDisabled ? 'opacity-30' : 'hover:opacity-75'}`;
        break;
    }

    switch (size) {
      case 'sm':
        switch (type) {
          case 'filled':
            baseClassName += ' h-[40px] rounded-full px-[16px] text-[14px]';
            break;
          case 'outline':
            baseClassName += ' h-[40px] rounded-full border-2 px-[16px] text-[14px]';
            break;
          case 'text':
            baseClassName += ' text-[14px]';
            break;
        }
        break;
      case 'md':
        switch (type) {
          case 'filled':
            baseClassName += ' h-[48px] rounded-full px-[24px] text-[18px]';
            break;
          case 'outline':
            baseClassName += ' h-[48px] rounded-full border-2 px-[24px] text-[18px]';
            break;
          case 'text':
            baseClassName += ' text-[18px]';
            break;
        }
        break;
      case 'lg':
        switch (type) {
          case 'filled':
            baseClassName += ' h-[56px] rounded-full px-[40px] text-[20px]';
            break;
          case 'outline':
            baseClassName += ' h-[56px] rounded-full border-2 px-[40px] text-[20px]';
            break;
          case 'text':
            baseClassName += ' text-[20px]';
            break;
        }
        break;
    }

    switch (color) {
      case 'black':
        switch (type) {
          case 'filled':
            baseClassName += ' bg-black text-white';
            break;
          case 'outline':
            baseClassName += ' border-black text-black';
            break;
          case 'text':
            baseClassName += ' text-black';
            break;
        }
        break;
      case 'green':
        switch (type) {
          case 'filled':
            baseClassName += ' bg-[#00E7A2] text-white';
            break;
          case 'outline':
            baseClassName += ' border-[#00E7A2] text-[#00E7A2]';
            break;
          case 'text':
            baseClassName += ' text-[#00E7A2]';
            break;
        }
        break;
      case 'red':
        switch (type) {
          case 'filled':
            baseClassName += ' bg-[#F66161] text-white';
            break;
          case 'outline':
            baseClassName += ' border-[#F66161] text-[#F66161]';
            break;
          case 'text':
            baseClassName += ' text-[#F66161]';
            break;
        }
        break;
      case 'gray':
        switch (type) {
          case 'filled':
            baseClassName += ' bg-[#777E90] text-[#23262F]';
            break;
          case 'outline':
            baseClassName += ' border-[#777E90] text-[#777E90]';
            break;
          case 'text':
            baseClassName += ' text-[#777E90]';
            break;
        }
        break;
    }

    return (
      <button
        ref={ref}
        className={twMerge(baseClassName, className)}
        type="button"
        disabled={finalDisabled}
        {...props}
      >
        {loading && <Spin className="mr-[10px]" />}
        {children}
      </button>
    );
  },
);
