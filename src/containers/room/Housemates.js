
import { IntlProvider, Text } from 'preact-i18n';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import Utils                  from '~/utils';
import style                  from '~/containers/room/style.css';

function Housemates({ lang, housemates, roomId }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <h3 className={style.heading}>
          <Text id="title">HouseMates</Text>
        </h3>
        <div className={style.housemates}>
          {housemates.map((housemate, index) => (
            <Housemate {...{ lang, housemate, roomId, index }} />
          ))}
        </div>
      </section>
    </IntlProvider>
  );
}

function Housemate({ lang, housemate, roomId, index }) {
  const pictoClass =
    `picto-colocataire_${housemate.gender || 'booked'}_${(index % 5) + 1}_256px`;

  return (
    <div className={style.housemate}>
      <div className={style.housemateTitle}>
        <Text id="bedroom">Bedroom</Text>&nbsp;{housemate.roomNumber}
      </div>
      {('availableAt' in housemate) ? (
        <div>
          <div className={`${style.availableRoom} picto-colocataire_disponible_256px`} />
          { housemate.roomId !== roomId ? (
            <Button raised primary href={`/${lang}/room/${housemate.roomId}`}>
              <Text id="view">view</Text>
            </Button>
          ) : (
            <Text id="available">Available</Text>
          ) }
        </div>
      ) : (
        <div>
          <div className={`${style.housemateIcon} ${pictoClass}`} />
          <div>
            { housemate.age ? (
              <ul className="unstyled" style="margin-bottom: 0;">
                <li><b>{housemate.firstName}</b></li>
                <li>{housemate.age} <Text id="yearsOld">years old</Text></li>
                <li>{ housemate.isStudent ? (
                  housemate.gender === 'male' ?
                    <Text id="student.male">Student</Text> :
                    <Text id="student.female">Student</Text>
                ) : (
                  housemate.gender === 'male' ?
                    <Text id="student.male">Student</Text> :
                    <Text id="student.female">Student</Text>
                ) }</li>
                <li>{housemate.countryEn}</li>
              </ul>
            ) : (
              <Text id="booked">Booked</Text>
            ) }
          </div>
        </div>
      )}
    </div>
  );
}

const definition = {
  'fr-FR': {
    title: 'Colocataires',
    available: 'Disponible',
    booked: 'Réservée',
    view: 'voir',
    bedroom: 'Chambre',
    yearsOld: 'ans',
    student: {
      female: 'Étudiante',
      male: 'Étudiant',
    },
    youngWorker: {
      female: 'Jeune active',
      male: 'Jeune actif',
    },
  },
  'es-ES': {
    title: 'Compañeros de cuarto',
    available: 'Disponible',
    booked: 'Reservado',
    view: 'ver',
    bedroom: 'Habitación',
    yearsOld: 'años',
    student: {
      female: 'Estudiante',
      male: 'Estudiante',
    },
    youngWorker: {
      female: 'Joven professional',
      male: 'Joven professional',
    },
  },
};

function mapStateToProps({ route: { lang, roomId }, apartments, rooms }, { apartmentId }) {
  const apartment = apartments[apartmentId];
  const housemates = Utils.parseHouseMates(apartment.housemates, lang);

  return {
    lang,
    roomId,
    housemates,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Housemates);
