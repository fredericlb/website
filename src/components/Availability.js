import { IntlProvider, Text } from 'preact-i18n';

function Availability({ lang, className, availableAt, arrivalDate }) {
  let icon = <span className="material-icons">check_circle</span>;
  let text = <Text id="availableNow">Available now</Text>;
  let _class = `${className} availableNow`;

  if ( availableAt === null ) {
    icon = <span className="material-icons">remove_circle</span>;
    text = <Text id="unavailable">Unavailable</Text>;
    _class = `${className} unavailable`;
  }
  else if ( +availableAt > +Date.now() ) {
    let date = availableAt.toLocaleDateString().replace(/\/\d{4}/, '');
    text = (
      <Text id="availableFrom" fields={{ date }}>
        {`Available from ${date}`}
      </Text>
    );
    if ( arrivalDate != null && (+availableAt > +arrivalDate) ) {
      icon = <span className="material-icons">warning</span>;
      _class = `${className} availableFrom`;
    }
  }

  return (
    <IntlProvider definition={definition[lang]}>
      <div className={_class}>
        {icon}{' '}
        {text}
      </div>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
    availableFrom: 'Dispo. le {{date}}',
    unavailable: 'Plus disponible',
    availableNow: 'Dispo. immédiatement',
  },
  'es-ES': {
    availableFrom: 'Disponible a partir de {{date}}',
    unavailable: 'Indisponible',
    availableNow: 'Inmediatamente disponible',
  },
};

// /!\ This component cannot used the state because it's used inside leaflet
// and apparently these things are incompatible.
export default Availability;
