import Link from '@docusaurus/Link';
import clsx from 'clsx';

import { FAQS } from '../faq.constants';
import shared from '../home.module.css';
import { revealAt } from '../home.utils';
import styles from './Faq.module.css';

export const Faq = () => (
  <section className={clsx('container', shared.section)} aria-labelledby="faq-title">
    <h2 id="faq-title" className={shared.h2} data-reveal>
      React Native picker FAQ
    </h2>
    <div className={styles.faq}>
      {FAQS.map((item, i) => (
        <details key={item.question} className={styles.faqItem} data-reveal style={revealAt(i)}>
          <summary>
            <h3>{item.question}</h3>
            <span className={styles.faqIcon} aria-hidden />
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
    <p className={shared.sectionLink}>
      <Link to="/docs/resources/faq">All questions →</Link>
    </p>
  </section>
);
