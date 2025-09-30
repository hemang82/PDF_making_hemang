import Image from 'next/image';
import { type JSX } from 'react';

interface BackgroundDecorationsProps {
  showTopLeft?: boolean;
  showBottomRight?: boolean;
}

const BackgroundDecorations = ({
  showTopLeft = true,
  showBottomRight = true,
}: BackgroundDecorationsProps): JSX.Element => {
  return (
    <>
      {/* Top Left Decorative Design */}
      {showTopLeft && (
        <Image
          priority
          className='pointer-events-none fixed top-[144px] left-0 -z-10'
          src='/images/pdf-tools/page-bg-decorative-loop-line-design.svg'
          alt=''
          role='presentation'
          aria-hidden='true'
          width={257}
          height={231}
        />
      )}

      {/* Bottom Right Decorative Design */}
      {showBottomRight && (
        <Image
          priority
          className='pointer-events-none fixed right-0 bottom-0 -z-10'
          src='/images/common/page-bg-decorative-dotted-design.svg'
          alt=''
          role='presentation'
          aria-hidden='true'
          width={177}
          height={188}
        />
      )}
    </>
  );
};

export default BackgroundDecorations;
