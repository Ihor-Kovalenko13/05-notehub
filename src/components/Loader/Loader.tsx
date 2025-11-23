import { BarLoader } from 'react-spinners';
import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.loaderWrapper}>
      <BarLoader color="#0b5ed7" speedMultiplier={0.6} />
    </div>
  );
}