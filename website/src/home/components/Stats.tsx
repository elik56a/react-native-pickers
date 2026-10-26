import { NPM_DOWNLOADS_STATUS, NPM_PACKAGE_URL, STATS } from '../home.constants';
import { useNpmDownloads } from '../hooks/useNpmDownloads';
import { CountUp } from './CountUp';
import styles from './Stats.module.css';

export const Stats = () => {
  const downloads = useNpmDownloads();
  return (
    <dl className={styles.stats}>
      {STATS.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>
            <CountUp value={stat.value} suffix={stat.suffix} />
          </dd>
        </div>
      ))}
      {downloads !== NPM_DOWNLOADS_STATUS.unavailable && (
        <div>
          <dt>
            <a href={NPM_PACKAGE_URL} className={styles.statLink}>
              npm downloads
            </a>
          </dt>
          <dd>{downloads === NPM_DOWNLOADS_STATUS.loading ? '—' : <CountUp value={downloads} />}</dd>
        </div>
      )}
    </dl>
  );
};
