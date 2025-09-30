import type { JSX } from 'react';
import Image from 'next/image';

const UploadSource = ({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }): JSX.Element => (
  <button
    type='button'
    className='hover:text-brand-primary-dark flex cursor-pointer items-center gap-1.5 text-xs transition-colors lg:text-sm xl:text-base'
    aria-label={`Upload from ${label}`}
    onClick={onClick}
  >
    <Image src={icon} alt={`${label} Icon`} width={24} height={24} />
    {label}
  </button>
);

export default UploadSource;
