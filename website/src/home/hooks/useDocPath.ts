import { useLatestVersion, useVersions } from '@docusaurus/plugin-content-docs/client';

/** Components added on master but not released yet only exist in the Next docs. */
export const useDocPath = () => {
  const latest = useLatestVersion(undefined);
  const versions = useVersions(undefined);
  return (id: string) => [latest, ...versions].flatMap((v) => v.docs).find((doc) => doc.id === id)?.path;
};
