import { type JSX, useState } from 'react';

// Custom Dropdown Component
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
}: CustomDropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className='relative'>
      {/* Dropdown Button */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='focus:border-brand-primary-dark focus:ring-brand-primary/20 flex h-[42px] w-full items-center justify-between rounded-lg border-2 border-white/20 bg-white/5 px-3 py-2 text-left text-white focus:ring-2 focus:outline-none'
      >
        <span className='truncate'>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsOpen(false);
              }
            }}
            tabIndex={0}
            aria-label='Close dropdown'
            role='button'
          />

          {/* Dropdown Content */}
          <div className='absolute z-20 mt-1 max-h-[200px] w-full overflow-hidden rounded-lg border border-white/20 bg-gray-800 shadow-lg'>
            {/* Search Input */}
            <div className='border-b border-white/10 p-2'>
              <input
                type='text'
                placeholder='Search languages...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='focus:border-brand-primary w-full rounded border border-white/20 bg-white/5 px-2 py-1 text-sm text-white placeholder-white/60 focus:outline-none'
              />
            </div>

            {/* Options List */}
            <div className='scrollbar-thin scrollbar-thumb-blue/20 scrollbar-track-transparent max-h-[150px] overflow-y-auto'>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-white/10 focus:bg-white/10 focus:outline-none ${
                      value === option.value ? 'bg-brand-primary/20 text-brand-primary-dark' : 'text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className='px-3 py-2 text-sm text-white/60'>No languages found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
