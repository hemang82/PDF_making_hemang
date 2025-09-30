import { Check } from 'lucide-react';
import { type JSX } from 'react';

// Compression levels
const COMPRESSION_LEVELS = [
  {
    id: 'extreme',
    title: 'EXTREME COMPRESSION',
    description: 'Less quality, high compression',
    value: 'extreme',
  },
  {
    id: 'recommended',
    title: 'RECOMMENDED COMPRESSION',
    description: 'Good quality, good compression',
    value: 'recommended',
  },
  {
    id: 'low',
    title: 'LESS COMPRESSION',
    description: 'High quality, less compression',
    value: 'low',
  },
];

interface CompressionLevelSelectionProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

const CompressionLevelSelection = ({ selectedLevel, onLevelChange }: CompressionLevelSelectionProps) => {
  return (
    <div className='w-full'>
      <h3 className='mt-8 mb-4 text-lg font-semibold text-white'>Compression level</h3>

      <div className='space-y-3'>
        {COMPRESSION_LEVELS.map((level) => (
          <div
            key={level.id}
            className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
              selectedLevel === level.value
                ? 'border-brand-primary-dark bg-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              onLevelChange(level.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onLevelChange(level.value);
              }
            }}
            role='button'
            tabIndex={0}
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div
                  className={`text-sm font-medium ${
                    selectedLevel === level.value ? 'text-brand-primary-dark' : 'text-white'
                  }`}
                >
                  {level.title}
                </div>
                <div className='mt-1 text-sm text-gray-500'>{level.description}</div>
              </div>

              {selectedLevel === level.value && (
                <div className='ml-3 flex-shrink-0'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
                    <Check size={16} className='text-white' />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SidebarContentProps {
  selectedCompressionLevel: string;
  onCompressionLevelChange: (level: string) => void;
}

const SidebarContent = ({ selectedCompressionLevel, onCompressionLevelChange }: SidebarContentProps): JSX.Element => {
  return (
    <>
      <p className='text-brand-slate-600 font-inter rounded-[10px] bg-white p-[21px] text-base/[23px] font-normal'>
        Compress your PDF files to reduce file size. Choose from different compression levels based on your quality and
        size requirements.
      </p>

      {/* Compression Level Selection */}
      <CompressionLevelSelection selectedLevel={selectedCompressionLevel} onLevelChange={onCompressionLevelChange} />
    </>
  );
};

export default SidebarContent;
