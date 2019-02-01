import { IntlProvider, Text } from 'preact-i18n';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import capitalize             from 'lodash/capitalize';
import CroppedContainer       from '~/components/room/CroppedContainer';
import * as actions           from '~/actions';
import style                  from './style.css';

const _ = { capitalize };

function Description({ lang, room, apartment, i18ns }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <h3 className={style.heading}>
          <Text id="title">Description</Text>
        </h3>
        <ul className={style.descriptionItems}>
          <li>
            <i className="icon-24 picto-description_surface" />
            <span>
              {apartment.floorArea}m²
              (<Text id="accommodation">accommodation</Text>)
            </span>
          </li>
          <ElevatorDetail {...{ lang, apartment }} />
          <BedDetail {...{ lang, room }} />
          <li>
            <i className="icon-24 picto-description_surface" />
            <span>{room.floorArea}m² (<Text id="room">room</Text>)</span>
          </li>
          <li className="two-thirds">
            <i className="icon-24 picto-picto_adresse" />
            <a href="#map">
              {apartment.addressStreet} {apartment.addressZip}{' '}
              {_.capitalize(apartment.addressCity)},{' '}
              {_.capitalize(apartment.addressCountry)}{' '}
            </a>
          </li>
        </ul>

        <CroppedContainer height={40}>
          {i18ns[`${room.id}-${lang}-description`]}
          <br />
          {i18ns[`${apartment.id}-${lang}-description`]}
        </CroppedContainer>
      </section>
    </IntlProvider>
  );
}

// TODO: this should be refactored with getBedDetails
// in ~/components/search/room
function BedDetail({ lang, room }) {
  return (
    <li>
      <i className={`icon-24 ${bedDetails[room.beds].css}`} />
      <span>{bedDetails[room.beds][lang]}</span>
    </li>
  );
}

function ElevatorDetail({ lang, apartment }) {
  return (
    <li>
      <i className="icon-24 picto-elevator" />
      { apartment.floor === 0 ? (
        <Text id="groundFloor">Ground floor</Text>
      ) : (
        <span>
          <Text id="floor">Floor</Text>{' '}
          {apartment.floor}{' '}
          {apartment.elevator ?
            <Text id="with">with</Text> :
            <Text id="without">without</Text>
          }{' '}
          <Text id="elevator">elevator</Text>
        </span>
      )}
    </li>
  );
}

const definition = {
  'fr-FR': {
    title: 'Description',
    accommodation: 'logement',
    groundFloor: 'Rez-de-chaussée',
    floor: 'Étage',
    elevator: 'ascenseur',
    room: 'chambre',
    with: 'avec',
    without: 'sans',
  },
  'es-ES': {
    title: 'Descripción',
    accommodation: 'vivienda',
    groundFloor: 'Planta baja',
    floor: 'Planta',
    elevator: 'ascensor',
    room: 'habitación ',
    with: 'con',
    without: 'sin',
  },
};

const bedDetails = {
  double: {
    'fr-FR': '1 lit double',
    'en-US': '1 double bed',
    'es-ES': '1 cama doble',
    css: 'picto-equipement_chambre_lit_double',
  },
  simple: {
    'fr-FR': '1 lit simple',
    'en-US': '1 simple bed',
    'es-ES': '1 cama simple',
    css: 'picto-equipement_chambre_lit_double',
  },
  sofa: {
    'fr-FR': '1 canapé-lit',
    'en-US': '1 sofa bed',
    'es-ES': '1 sofá-cama',
    css: 'picto-equipement_chambre_canape_ou_canape_lit',
  },
  'double+sofa': {
    'fr-FR': '1 lit double et un canapé-lit',
    'en-US': '1 double bed and a sofa bed',
    'es-ES': '1 cama doble y un sofá-cama',
    css: 'picto-equipement_chambre_lit_double',
  },
  'simple+sofa': {
    'fr-FR': '1 lit simple et un canapé-lit',
    'en-US': '1 simple bed and a sofa bed',
    'es-ES': '1 cama simple y un sofá-cama',
    css: 'picto-equipement_chambre_lit_double' ,
  },
  'simple+simple': {
    'fr-FR': '2 lits simple',
    'en-US': '2 simple beds',
    'es-ES': '2 camas simples',
    css: 'picto-equipement_chambre_lit_double',
  },
};

function mapStateToProps({ route: { lang }, rooms, apartments, i18ns }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    apartment,
    i18ns,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Description);
