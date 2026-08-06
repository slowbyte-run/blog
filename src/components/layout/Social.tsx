import type { CSSProperties } from 'react';
import { blogSocialConfig } from '@/config/blogLayoutConfig';
import { cn } from '@lib/utils';

export function Social() {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {Object.entries(blogSocialConfig).map(([key, config]) => {
        const { url, label, iconClass, color } = config;
        return (
          <div key={key}>
            <a
              className={cn(
                'social-link flex-center group relative overflow-hidden rounded-xl px-1.5 py-1 transition-all duration-300 group-hover:scale-105',
              )}
              style={
                color ? ({ '--link-color': color } as CSSProperties) : undefined
              }
              data-platform={key}
              href={url}
              title={label}
              data-tooltip-interactive="false"
              data-tooltip-placement="top"
              aria-label={label}
              suppressHydrationWarning>
              {iconClass && (
                <i
                  className={`${iconClass} social-icon`}
                  aria-hidden="true"></i>
              )}
              <span className="absolute inset-0 -z-10 -translate-x-full translate-y-full rounded-xl transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default Social;
