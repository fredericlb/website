import get                    from 'lodash/get';
import { Component }          from 'preact';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import mapDispatchToProps     from '~/actions/mapDispatchToProps';
import { Snackbar }           from 'react-toolbox/lib/snackbar';
import style                  from './style.css';

const  _ = { get };

class Banner extends Component {
  @autobind
  handleClick() {
    this.props.actions.hideInfoSnackbar();
  }

  constructor(props) {
    super(props);
    this.state = {
      isActive: null,
    };
  }

  componentWillMount() {
    const { actions, lang, roomId, cityId, cityInfo, roomInfo } = this.props;
    const key = 'banner';

    if ( roomId && roomInfo == null ) {
      actions.getI18n({ id: roomId, locale: lang, key });
    }

    if ( cityId && cityInfo == null ) {
      actions.getI18n({ id: cityId, locale: lang, key });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      if ( this.state.isActive !== false ) {
        this.props.actions.showInfoSnackbar();
      }
    }, 2000);
  }

  componentWillReceiveProps({ lang, roomId, cityId }) {
    const { actions } = this.props;
    const key = 'banner';

    if ( roomId && roomId !== this.props.roomId || lang !== this.props.lang ) {
      actions.getI18n({ id: roomId, locale: lang, key });
    }

    if ( cityId && cityId !== this.props.cityId || lang !== this.props.lang ) {
      actions.getI18n({ id: cityId, locale: lang, key });
    }
  }

  render({ lang, isActive, info }) {
    return (
      <Snackbar
        action="❌"
        active={isActive}
        label={info}
        timeout={999999}
        onClick={this.handleClick}
        type="cancel"
        theme={style}
      />
    );
  }
}

function mapStateToProps(args) {
  const { route: { lang, roomId, city }, session, rooms, apartments, i18ns } = args;
  const apartmentId = _.get(rooms, `${roomId}.ApartmentId`, '');
  // Promo banners shouldn't be displayed if the room isn't available
  // since banners are only used for promos right now, this is hardcoded here.
  // In the future, we should Use Google Tag Manager to pilot those banners and
  // give more control to sales and marketing
  const isSellable = _.get(rooms, `${roomId}.availableAt`, '') !== null;
  const cityId = city ?
    city.toLowerCase() :
    _.get(apartments, `${apartmentId}.addressCity`);
  const roomInfo = roomId && i18ns[`${roomId}-${lang}-banner`];
  const cityInfo = cityId && i18ns[`${cityId}-${lang}-banner`];
  const isActive =
    (cityInfo || roomInfo) && isSellable && session.isInfoSnackbarActive;
  const info = roomInfo || cityInfo;

  return {
    lang,
    isActive,
    roomInfo,
    cityInfo,
    info,
    roomId,
    cityId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
