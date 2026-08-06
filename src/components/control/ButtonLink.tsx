import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'gradient-shoka': 'bg-gradient-shoka-button text-primary-foreground',
        unstyle: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonLinkBaseProps = {
  label?: string;
  className?: string;
  children: ReactNode;
} & VariantProps<typeof buttonVariants>;

type ButtonLinkAnchorProps = ButtonLinkBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    url: string;
  };

type ButtonLinkButtonProps = ButtonLinkBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    url?: undefined;
  };

type ButtonLinkProps = ButtonLinkAnchorProps | ButtonLinkButtonProps;

export function ButtonLink({
  url,
  label,
  variant,
  size,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const isLink = typeof url === 'string' && url.length > 0;

  if (isLink) {
    const anchorProps = rest as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      'href'
    >;
    return (
      <a
        href={url}
        aria-label={label}
        className={cn(buttonVariants({ variant, size }), className)}
        {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

export default ButtonLink;
