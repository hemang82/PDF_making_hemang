import type { JSX } from 'react';
// import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import DiscoverNow from '@/components/home/DiscoverNow';
import WeProvide from '@/components/home/WeProvide';
import Footer from '@/components/footer/Footer';
import GetPremium from '@/components/home/GetPremium';

const Home = (): JSX.Element => {
  return (
    <>
      {/* <Hero /> */}
      <Categories />
      <DiscoverNow />
      <WeProvide />
      <GetPremium />
      <Footer />
    </>
  );
};

export default Home;
