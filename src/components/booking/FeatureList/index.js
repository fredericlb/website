import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import Tooltip                from 'react-toolbox/lib/tooltip';
import Utils                  from '~/utils';
import featuresEn             from './features-en';
import featuresFr             from './features-fr';
import featuresEs             from './features-es';
import {
  sublist,
  valueCell,
  valueText,
  valueCellHeader,
  button,
  featureCell,
  featureLabel,
  featureDetails,
  colorBasic,
  colorComfort,
  colorPrivilege,
}                             from './style.css';

const TooltipButton = Tooltip(Button);
const features = Object.assign({}, featuresEn, featuresFr, featuresEs);
const colorClasses = [colorBasic, colorComfort, colorPrivilege];

function FeatureList({ lang, isPriceHidden, packLines = [], depositLines = [] }) {
  const sublists = features[lang]({ packLines, depositLines })
    .reduce((acc, curr) => (
      curr.length === 1 ?
        acc.unshift([curr[0], []]) && acc :
        acc[0][1].push(curr) && acc
    ), [])
    .reverse();

  return (
    <IntlProvider definition={definition[lang]}>
      <div>
        {sublists.map(([header, features], i) => (
          // the first four sublists aren't prices
          ( isPriceHidden && i > 3 ) ?
            '' : <Sublist key={header} {...{ header, features }} />
        ))}
      </div>
    </IntlProvider>
  );
}

// Memoization is simpler at this level instead of FeatureList level as element
// receive arguments more likely to change.
function Sublist({ header, features }) {
  return (
    <table className={sublist}>
      <thead>
        <tr>
          <th>{header}</th>
          <th className={valueCellHeader}><Text id="basic">Basic</Text></th>
          <th className={valueCellHeader}><Text id="comfort">Comfort</Text></th>
          <th className={valueCellHeader}><Text id="privilege">Privilege</Text></th>
        </tr>
      </thead>
      <tbody>
        {features.map(([label, tooltip, ...values]) => (
          <tr>
            <td className={featureCell}>
              <span className={featureLabel}>
                <TooltipButton
                  label={label}
                  tooltip={`${label.toUpperCase()} — ${tooltip}`}
                  tooltipShowOnClick
                  theme={({ button })}
                  ripple={false}
                />
              </span>
              <span className={featureDetails}>— {tooltip}</span>
            </td>
            {values.map((value, i) => (
              <td className={`${valueCell} ${value && colorClasses[i]}`}>
                {typeof value === 'string' ?
                  <span className={valueText}>{value}</span> : ( value ? '✔' : '✘' )
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const definition = {
  'fr-FR': {
    basic: 'Basique',
    comfort: 'Confort',
    privilege: 'Privilège',
  },
  'es-ES': {
    basic: 'Básico',
    comfort: 'Comodidad',
    privilege: 'Privilegio',
  },
};

export default Utils.connectLang(FeatureList);
