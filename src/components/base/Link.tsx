import { ComponentPropsWithoutRef, ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type Ref = ComponentRef<'a'> | ComponentRef<typeof RouterLink>;

type Props = (ComponentPropsWithoutRef<'a'> | ComponentPropsWithoutRef<typeof RouterLink>) & {
  type?: 'text' | 'image' | 'unstyled';
  size?: 'sm' | 'md' | 'lg';
  color?: 'black' | 'gray';
  disabled?: boolean;
};

export const Link = forwardRef<Ref, Props>(
  (
    {
      className,
      type = 'unstyled',
      size = 'md',
      color = 'black',
      disabled = false,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    let baseClassName = `inline-flex items-center justify-center font-semibold no-underline transition-all duration-300 ${
      disabled ? 'cursor-not-allowed' : ''
    }`;

    switch (type) {
      case 'text':
      case 'image':
        baseClassName += ` ${disabled ? 'opacity-30' : 'hover:opacity-75'}`;
        break;
    }

    switch (size) {
      case 'sm':
        switch (type) {
          case 'text':
            baseClassName += ' text-[14px]';
            break;
        }
        break;
      case 'md':
        switch (type) {
          case 'text':
            baseClassName += ' text-[16px]';
            break;
        }
        break;
      case 'lg':
        switch (type) {
          case 'text':
            baseClassName += ' text-[24px]';
            break;
        }
        break;
    }

    switch (color) {
      case 'black':
        switch (type) {
          case 'text':
            baseClassName += ' text-black';
            break;
        }
        break;
      case 'gray':
        switch (type) {
          case 'text':
            baseClassName += ' text-[#777E90]';
            break;
        }
        break;
    }

    return 'to' in props && props.to != undefined ? (
      <RouterLink
        ref={ref}
        className={twMerge(baseClassName, className)}
        onClick={disabled ? event => event.preventDefault() : onClick}
        {...props}
      >
        {children}
      </RouterLink>
    ) : (
      <a
        ref={ref}
        className={twMerge(baseClassName, className)}
        rel="noopener noreferrer"
        onClick={disabled ? event => event.preventDefault() : onClick}
        {...props}
      >
        {children}
      </a>
    );
  },
);
