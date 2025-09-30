import type { JSX, ReactNode } from 'react';
import BackgroundDecorations from '@/components/common/BackgroundDecorations';

interface PageSectionProps {
  children: ReactNode;
}

/**
 * A common section component used across PDF tool client pages
 * Provides consistent styling and background decorations
 */
const PageSection = ({ children }: PageSectionProps): JSX.Element => {
  return (
    // <section className={`lg:relative lg:h-[calc(100vh-145px)] ${className || ''}`}>
    <section>
      {/* Decorative Layers */}
      <BackgroundDecorations />

      {/* Main Content */}
      {children}
    </section>
  );
};

export default PageSection;
