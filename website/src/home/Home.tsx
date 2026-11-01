import { useRef } from 'react';

import Layout from '@theme/Layout';

import { AiDocs } from './components/AiDocs';
import { Anatomy } from './components/Anatomy';
import { Comparison } from './components/Comparison';
import { ComponentGrid } from './components/ComponentGrid';
import { Faq } from './components/Faq';
import { GetStarted } from './components/GetStarted';
import { Hero } from './components/Hero';
import { PlaygroundSection } from './components/PlaygroundSection';
import { PAGE_DESCRIPTION, PAGE_TITLE } from './home.constants';
import shared from './home.module.css';
import { useNavbarOnScroll } from './hooks/useNavbarOnScroll';
import { useScrollReveal } from './hooks/useScrollReveal';

export const Home = () => {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);
  useNavbarOnScroll();
  return (
    <Layout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
      <Hero />
      <main ref={mainRef} className={shared.page} data-home>
        <ComponentGrid />
        <Anatomy />
        <Comparison />
        <PlaygroundSection />
        <AiDocs />
        <Faq />
        <GetStarted />
      </main>
    </Layout>
  );
};
