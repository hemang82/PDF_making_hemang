import MyContainer from '@/components/common/MyContainer';
import Image from 'next/image';
import type { JSX } from 'react';

interface ServiceData {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const servicesData: ServiceData[] = [
  {
    id: 1,
    icon: '/images/home/weprovide-fast-conversion.svg', // Replace with your actual icon path
    title: 'Fast conversion',
    description:
      'It takes about 5 seconds on average to convert from PDF or vice versa. Upload your file now and see for yourself!',
  },
  {
    id: 2,
    icon: '/images/home/weprovide-tax-form.svg', // Replace with your actual icon path
    title: 'Tax forms database',
    description:
      "We've gathered hundreds of tax, insurance, and other forms in one place to help you find and edit them with ease.",
  },
  {
    id: 3,
    icon: '/images/home/weprovide-merge-pdf.svg', // Replace with your actual icon path
    title: 'Merge PDFs into one',
    description:
      'Easily merge your contracts, reports, or presentations into a single PDF to keep everything organized and accessible.',
  },
  {
    id: 4,
    icon: '/images/home/weprovide-e-signature.svg', // Replace with your actual icon path
    title: 'Easy e-Signature',
    description:
      'We offer 3 ways to sign PDF documents. You can either draw, type, or upload your signature as an image.',
  },
  {
    id: 5,
    icon: '/images/home/weprovide-compress-pdf.svg', // Replace with your actual icon path
    title: 'Compress PDF file size',
    description:
      'PDF optimizes your files to make them easier to share and store, all while maintaining their original quality.',
  },
  {
    id: 6,
    icon: '/images/home/weprovide-password-protection.svg', // Replace with your actual icon path
    title: 'Password protection',
    description:
      'If you want to prevent others from opening, editing, or printing your documents, you can lock them down and control access.',
  },
];

interface ServiceCardProps {
  service: ServiceData;
}

const ServiceCard = ({ service }: ServiceCardProps): JSX.Element => {
  return (
    <div className='relative h-full rounded-[10px] border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg'>
      {/* Icon Container */}
      <div className='bg-brand-primary bg-opacity-10 absolute top-[-30px] mb-6 flex h-16 w-16 items-center justify-center rounded-lg'>
        <Image src={service.icon} alt={`${service.title} icon`} width={32} height={32} className='h-8 w-8' />
      </div>

      {/* Content */}
      <div>
        <h3 className='mt-8 mb-3 text-lg/[25px] font-semibold text-gray-900'>{service.title}</h3>
        <p className='text-brand-slate-600 text-base font-[400]'>{service.description}</p>
      </div>
    </div>
  );
};

const WeProvide = (): JSX.Element => {
  return (
    <section className='relative pt-[100px] pb-[157px]'>
      <MyContainer>
        <div className='mx-auto text-center'>
          <span className='bg-brand-primary font-inter rounded-full px-[50px] py-1 text-base font-medium text-white'>
            Provide
          </span>
          <h2 className='mt-3.5 mb-[40px] text-4xl/[48px] font-semibold'>What we have to offer beyond PDF editing</h2>
          <div className='grid grid-cols-1 gap-x-8 gap-y-22 pt-8 text-left md:grid-cols-2 lg:grid-cols-3'>
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </MyContainer>
    </section>
  );
};
export default WeProvide;
