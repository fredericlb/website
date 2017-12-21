import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import * as actions           from '~/actions';

import style from './style.css';


const _ = { capitalize };

class Pictures extends PureComponent {
  renderBedDetail() {
    const { room, lang } = this.props;

    return (
      <li>{bedDetails[room.beds][lang]}</li>
    );
  }

  renderElevatorDetail() {
    const { apartment, lang, roomFeatures } = this.props;

    return (
      <li>
        {apartment.floor}{' '}
        <Text id="floor">floor</Text>{' '}
        {roomFeatures.some(({ name, taxonomy }) => name === 'noElevator') ?
          elevatorDetail.without[lang] : elevatorDetail.with[lang]
        }{' '}
        <Text id="elevator">elevator</Text>
      </li>
    );
  }
  render() {
    const {
      lang,
      room,
      roomFeatures,
      apartment,
    } = this.props;

    if ( !room || !apartment || !roomFeatures ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3 className={style.heading}><Text id="title">Description</Text></h3>
          <ul class="grid-4 has-gutter">
            <li>{apartment.floorArea}m² (<Text id="apartment">apartment</Text>)</li>
            {this.renderElevatorDetail()}
            {this.renderBedDetail()}
            <li>{room.floorArea}m² (<Text id="room">room</Text>)</li>
            <li class="two-thirds">{apartment.addressStreet} {apartment.addressZip} {_.capitalize(apartment.addressCity)}, {_.capitalize(apartment.addressCountry)}</li>
          </ul>
          <div>{room[`description${_.capitalize(lang.split('-')[0])}`]}
            <br />
            {apartment[`description${_.capitalize(lang.split('-')[0])}`]}
          </div>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Description',
  apartment: 'logement',
  floor: 'étage',
  elevator: 'ascenseur',
  room: 'chambre',
} };

const bedDetails = {
  double: { 'fr-FR': '1 lit double', 'en-US': '1 double bed' },
  simple: { 'fr-FR': '1 lit simple', 'en-US': '1 simple bed' },
  sofa: { 'fr-FR': '1 canapé-lit', 'en-US': '1 sofa bed' },
  'double+sofa': { 'fr-FR': '1 lit double et un canapé-lit', 'en-US': '1 double bed and a sofa bed' },
  'simple+sofa': { 'fr-FR': '1 lit simple et un canapé-lit', 'en-US': '1 simple bed and a sofa bed' },
  'simple+simple': { 'fr-FR': '2 lits simple', 'en-US': '2 simple beds' },
};

const elevatorDetail = {
  with: { 'fr-FR': 'avec', 'en-US': 'with' },
  without: { 'fr-FR': 'sans', 'en-US': 'without' },
};

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    roomFeatures: room && room.Terms,
    apartment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
