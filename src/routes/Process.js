import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { IntlProvider, Text } from 'preact-i18n';
import _const                 from '~/const';
import * as actions           from '~/actions';
import Card                   from '~/components/Card';
import PackList               from '~/components/PackList';
import FeatureList					  from '~/components/booking/FeatureList';

const { SEARCHABLE_CITIES } = _const;

class Services extends PureComponent {
  componentWillMount() {
    const { products, actions } = this.props;

    if ( !products || Object.keys(products).length === 0 ) {
      return Promise.all([
        actions.listProducts({ id: '*-pack' }),
        actions.listProducts({ id: '*-deposit' }),
      ]);
    }
  }

  render({ lang }) {
    const { packLines, depositLines } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div className="content service">
          <h2>
            <Text id="steps">Book your accomodation in less than 1 minute</Text>
          </h2>
          <div className="grid-4 has-gutter-xl">
            {steps.map((step) => (
              <Card
                title={step[lang].title}
                content={step[lang].content}
                image={step.image}
              />
            ))}
          </div>
          <h2>
            <Text id="choose">Choose your housing pack</Text>
          </h2>
          <p>
            <Text id="subtitle">All the different services throughout your stay depending on which Housing Pack you have chosen:</Text>
          </p>
          <PackList pack="comfort" isPriceHidden />
          <h2>
            <Text id="comparison">Detailed comparison of the Housing Packs</Text>
          </h2>
          <FeatureList {...{ packLines, depositLines }} />
          <p>
            <b>Important</b> |
            <Text id="deposit">
              The deposit and the Housing Pack are 2 different amounts.
              The deposit is refundable while the Housing Pack is not.
            </Text>
          </p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    steps: 'Réservez votre logement en moins d\'une minute',
    choose: 'Choisissez votre pack logement',
    subtitle: 'Différentes gammes de services pour votre logement, tout au long du séjour, selon le pack choisi :',
    comparison: 'Comparaison détaillée des différents packs',
    deposit: 'La caution et le pack logement sont deux montants différents. La caution est remboursable, pas le pack logement.',
  },
  'es-ES': {
    steps: 'Reserva su alojamiento en menos de un minuto',
    choose: 'Elija su Housing Pack',
    subtitle: 'Distintas gamas de servicios para su alojamiento, a lo largo de su estancia, según el pack elegido :',
    comparison: 'Comparación detallada de los diferentes Packs',
    deposit: 'La fianza y el Housing Pack son dos distintos importes. La fianza es un importe reembolsable pero no el Housing Pack.',
  },
};

const steps = [{
  image: require('../assets/booking/step-one.png'),
  'en-US': {
    title: 'Find',
    content: 'Your ideal accomodation from hundreds of flat shares.',
  },
  'fr-FR': {
    title: 'Trouvez',
    content: 'Votre logement idéal parmi nos centaines d\'offres de colocations.',
  },
  'es-ES': {
    title: 'Encuentre',
    content: 'el alojamiento de sus sueños entre nuestras centenas de viviendas compartidas.',
  },
}, {
  image: require('../assets/booking/step-two.png'),
  'en-US': {
    title: 'Choose',
    content: 'Your Housing Pack from the list below. All our services are included in the pack and the payment allows us to complete your booking.',
  },
  'fr-FR': {
    title: 'Choisissez',
    content: 'Votre Pack Logement parmi la liste ci-dessous. Nos services sont inclus dedans et son paiement finalise votre réservation.',
  },
  'es-ES': {
    title: 'Elija',
    content: 'su Housing Pack en la siguiente lista. Todos nuestros servicios están incluidos en el Housing Pack y su pago finaliza su reserva.',
  },
}, {
  image: require('../assets/booking/step-three.png'),
  'en-US': {
    title: 'Arrive',
    content: 'In your new city with your baggage and pick up your keys.',
  },
  'fr-FR': {
    title: 'Venez',
    content: 'Dans votre nouvelle ville avec vos bagages pour récupérer vos clefs.',
  },
  'es-ES': {
    title: 'Llegue',
    content: 'A su nueva ciudad con su equipaje para recoger sus llaves.',
  },
}, {
  image: require('../assets/booking/step-four.png'),
  'en-US': {
    title: 'Move in',
    content: 'To your new home and enjoy our services throughout your whole stay!',
  },
  'fr-FR': {
    title: 'Emmenagez',
    content: 'Dans votre nouveau logement et profitez de nos services tout au long de votre séjour.',
  },
  'es-ES': {
    title: 'Múdense',
    content: 'A su nuevo alojamiento y disfruta de nuestros servicios durante toda su estancia!',
  },
}];

function mapStateToProps({ route: { lang }, products }) {
  if ( products.isLoading || Object.keys(products).length === 0 ) {
    return { isLoading: true };
  }

  return {
    lang,
    products,
    packLines:
      SEARCHABLE_CITIES
        .map(({ name }) => {
          const city = name.toLowerCase();
          const prices = ['basic', 'comfort', 'privilege'].map((level) =>
            `${(products[`${city}-${level}-pack`] || {}).price / 100}€`
          );

          // make sure the product has been loaded before displaying the line
          return `${city}-basic-pack` in products && [name, ''].concat(prices);
        })
        .filter(Boolean),
    depositLines:
      SEARCHABLE_CITIES
        .map(({ name }) => {
          const city = name.toLowerCase();
          const prices = [1,2,3].map(() =>
            `${(products[`${city}-deposit`] || {}).price / 100}€`
          );

          // make sure the product has been loaded before displaying the line
          return `${city}-deposit` in products && [name, ''].concat(prices);
        })
        .filter(Boolean),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);
