import { IntlProvider }       from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { bindActionCreators } from 'redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import RoomContent            from '~/containers/room/RoomContent';
import * as actions           from '~/actions';
import Header                 from '~/containers/room/Header';

class Room extends PureComponent {

  static async prefetch(lang, roomId, dispatch) {
    return Room.loadData(lang, roomId, {
      getRoom: (roomId) => dispatch(actions.getRoom(roomId)),
      getDistrict: (districtId) => dispatch(actions.getDisplayMedia(districtId)),
    });
  }

  static async loadData(lang, roomId, actions) {
    try {
      const { response: {
        data: [roomData],
        included: [apartmentData],
      } } = await actions.getRoom(roomId);
      const districtId = apartmentData.attributes._DistrictId;

      // This trick was used to allow linking from WordPress to the new website
      if ( roomData.id !== roomId && typeof window !== 'undefined' ) {
        return route(window.location.pathname.replace(/[\w-]+$/, roomData.id));
      }

      return actions.getDistrict(districtId);
    }
    catch (e) {
      console.error(e);
      route(`/${lang}/404`);
    }

  }

  componentWillMount() {
    if ( !this.props.room ) {
      return Room.loadData(this.props.lang, this.props.roomId, this.props.actions);
    }
  }

  componentWillReceiveProps({ roomId }) {
    if ( roomId !== this.props.roomId ) {
      Room.loadData(roomId, this.props.actions);
    }
  }

  render() {
    const {
      lang,
      roomId,
      room,
      isLoading,
    } = this.props;

    if ( isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <Header roomId={roomId} apartmentId={room.ApartmentId} />
          <RoomContent roomId={roomId} apartmentId={room.ApartmentId} />
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang }, apartments, rooms }, { roomId }) {
  const room = rooms[roomId];

  if ( !room || room.isLoading || !('pic 0 url' in room) ) {
    return { isLoading: true };
  }

  return {
    lang,
    roomId,
    room,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
