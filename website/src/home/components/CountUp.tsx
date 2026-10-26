import { useCountUp } from '../hooks/useCountUp';

export const CountUp = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const shown = useCountUp(value);
  return (
    <>
      {shown.toLocaleString('en-US')}
      {suffix}
    </>
  );
};
