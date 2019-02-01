import random                 from 'lodash/random';
import { Component }          from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
import Features               from '~/components/room/Features';
import Pictures               from '~/components/room/Pictures';
import Housemates             from '~/components/room/Housemates';
import Description            from '~/components/room/Description';
import ApartmentDescription   from '~/components/room/ApartmentDescription';
import BookingInfo            from '~/components/room/BookingInfo';
import SingleMap              from '~/components/room/Map';
import Availability           from '~/components/Availability';
import RoomServices           from '~/components/room/RoomServices';
import Questions              from '~/components/room/Questions';
import Guide                  from '~/components/room/Guide';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import style                  from './style.css';
const _ = { random };

class RoomContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      libSpyScroll: null,
    };

    if ( typeof window === 'object' ) {
      import('react-spy-scroll')
        .then(spyScroll => {
          this.setState({ libSpyScroll: spyScroll });

          return true;
        })
        .catch(() => console.error('leaflet loading failed'));
    }
  }

  render({ lang, roomId, apartmentId, room, apartment, viewsCount }) {
    const { availableAt } = room;
    let AnchorLink = 'a';
    let AnchorElement = 'div';

    if ( this.state.libSpyScroll ) {
      AnchorElement = this.state.libSpyScroll.AnchorElement;
      AnchorLink = this.state.libSpyScroll.AnchorLink;
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div className={style.roomPage}>
          <div className={`${style.roomContent} content content-wide`}>
            <div className={style.mainColumns}>
              <div>
                <div className={[style.leftHeader]}>
                  {room.name}
                </div>
                <div className={style.links} id="room-anchors">
                  <ul>
                    <li>
                      <AnchorLink href="overview"><Text id="overview">Overview</Text></AnchorLink>
                    </li>
                    <li>
                      <AnchorLink href="housemates"><Text id="housemates">Housemates</Text></AnchorLink>
                    </li>
                    <li>
                      <AnchorLink href="location"><Text id="location">Location</Text></AnchorLink>
                    </li>
                  </ul>
                </div>
                <AnchorElement id="overview" className={style.roomAnchor}>
                  <div>
                    <Pictures roomId={roomId} apartmentId={apartmentId} />
                    <Description roomId={roomId} apartmentId={apartmentId} />
                    <Features roomId={roomId} apartmentId={apartmentId} />
                  </div>
                </AnchorElement>
                <AnchorElement id="housemates" className={style.roomAnchor}>
                  <Housemates apartmentId={apartmentId} />
                </AnchorElement>
                <AnchorElement id="location" className={style.roomAnchor}>
                  <ApartmentDescription />
                </AnchorElement>
              </div>
              <div>
                <div className={style.rightHeader}>
                  <Availability
                    {...{ lang, availableAt }}
                  />
                </div>
                <BookingInfo roomId={roomId} apartmentId={apartmentId} />
                <div className={style.sameRoomCount}>
                  <Text id="viewsCount" fields={{ viewsCount }}>
                    {`${viewsCount} visitors viewed this room this week.`}
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <a id="map" className={style.roomAnchor} />
          { typeof window !== 'object' ? null :
            <SingleMap apartment={apartment} />
          }

          <RoomServices />
          <Questions />
          <Guide />
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    overview: 'Aperçu',
    housemates: 'Colocataires',
    location: 'Localisation',
    viewsCount: '{{viewsCount}} personnes ont consulté cette annonce cette semaine.',
  },
  'es-ES': {
    overview: 'Vista previa',
    housemates: 'Compañeros de cuarto',
    location: 'Localización',
    viewsCount: '{{viewsCount}} personas vieron este anuncio esta semana.',
  },
};

function mapStateToProps({ route: { lang }, rooms, apartments, i18ns }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room: { ...room, name: Utils.localizeRoomName(room.name, lang) },
    apartment,
    i18ns,
    viewsCount: (
      100 +
      ((new Date()).getDate() * 2) +
      room.id.toLowerCase().charCodeAt(0) +
      _.random(0, 7)
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomContent);
