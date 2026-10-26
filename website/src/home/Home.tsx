import { useRef } from 'react';

import Layout from '@theme/Layout';

import { AiDocs } from './components/AiDocs';
import { CodeSample } from './components/CodeSample';
import { Comparison } from './components/Comparison';
import { ComponentGrid } from './components/ComponentGrid';
import { Faq } from './components/Faq';
import { Features } from './components/Features';
import { Hero } from './components/Hero';
import { PlaygroundSection } from './components/PlaygroundSection';
import { PAGE_DESCRIPTION, PAGE_TITLE } from './home.constants';
import shared from './home.module.css';
import { useScrollReveal } from './hooks/useScrollReveal';

export const Home = () => {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);
  return (
    <Layout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
      <Hero />
      <main ref={mainRef} className={shared.page}>
        <ComponentGrid />
        <Features />
        <PlaygroundSection />
        <CodeSample />
        <Comparison />
        <Faq />
        <AiDocs />
      </main>
    </Layout>
  );
};
