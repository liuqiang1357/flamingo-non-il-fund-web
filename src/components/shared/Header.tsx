import { ComponentProps, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Link } from 'components/base/Link';
import { Container } from './Container';
import { Wallets } from './Wallets';

export const Header: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div className={twMerge('flex h-[var(--header-height)] items-center', className)} {...props}>
      <Container className="flex items-center justify-between">
        <Link className="text-[24px]" type="text" to="/">
          Flamingo non-IL Fund
        </Link>
        <Wallets />
      </Container>
    </div>
  );
};
