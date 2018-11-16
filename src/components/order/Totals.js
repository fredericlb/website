import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import style                  from './style';

function Totals({ lang, order }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <table className={`${style.totals} ${style.noborder}`}>

      </table>
    </IntlProvider>
  );
}



export default Utils.connectLang(Totals);
