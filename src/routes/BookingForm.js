import { IntlProvider, Text } from 'preact-i18n';
import { route }              from 'preact-router';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import BookingFormSections    from '~/components/booking/BookingFormSections';
import Heading                from '~/components/booking/Heading';
import Utils                  from '~/utils';
import * as actions           from '~/actions';

class BookingForm extends PureComponent {
  @autobind
  async handleSubmit() {
    const {
      room,
      booking,
      actions,
      lang,
    } = this.props;

    await actions.validateBooking(booking);
    const intervalId = setInterval(() => (
      this.setState({ progress: this.state.progress + 7 })
    ), 700);

    this.setState({ intervalId, progress: 7 });

    const { response: { rentingId } } =
      await actions.saveBooking({ room, booking, lang });

    this.resetProgress();

    route(`/${this.props.lang}/summary/${rentingId}`);
  }

  @autobind
  resetProgress() {
    this.state.intervalId && clearInterval(this.state.intervalId);

    this.setState({ progress: 0 });
  }

  constructor(props) {
    super(props);

    this.state = { progress: 0 };
  }

  componentWillMount() {
    const { roomId, actions } = this.props;

    this.setState({ progress: 0 });
    actions.updateBooking({ roomId });
  }

  async componentDidMount() {
    const {
      roomId,
      room,
      city,
      packPrices,
      actions,
    } = this.props;
    const promises = [];

    if ( !room ) {
      promises.push(actions.getRoom(roomId));
    }

    if ( (!packPrices || Object.keys(packPrices).length === 0) && city ) {
      promises.push(actions.listProducts({ id: `${city}-*` }));
    }

    return promises;
  }

  componentWillReceiveProps({ roomId, city }) {
    const { actions } = this.props;

    if ( roomId && roomId !== this.props.roomId ) {
      actions.getRoom(roomId);
    }

    if ( city && city !== this.props.city ) {
      actions.listProducts({ id: `${city}-*` });
    }
  }

  componentWillUnmount() {
    this.resetProgress();
  }

  // Note: `user` comes from the URL, courtesy of our router
  render() {
    const {
      lang,
      room,
      booking,
      isLoading,
    } = this.props;
    const { progress } = this.state;
console.log(progress);
    if ( isLoading ) {
      return (
        <div className="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    // This is probably never true
    if ( room.name === undefined ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <h1 className="content">
            <Text id="errors.room">
              Sorry, an error occured while preparing your booking for this room.
            </Text>
          </h1>
        </IntlProvider>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div className="content">
          <Heading room={room} type="details" />

          { room.availableAt === null ?
            <p>
              <Text id="errors.unavailable">
                Sorry, this room isn't available for booking.
              </Text>
            </p> :
            <BookingFormSections />
          }

          <nav className="text-center">
            { booking.isSaving ?
              <ProgressBar type="linear" mode="determinate" value={progress} /> :
              <Button raised primary
                label="Continue"
                icon="forward"
                onClick={this.handleSubmit}
              />
            }
          </nav>
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    errors: {
      unavailable: 'Désolé, cette chambre n\'est plus disponible.',
      room: 'Désolé, une erreur est survenue lors de la préparation de votre réservation.',
    },
    button: 'Continuer',
  },
  'es-ES': {
    errors: {
      unavailable: 'Lo sentimos, esta habitación ya no está disponible.',
      room: 'Lo sentimos, se ha producido un error durante la preparación de su reserva.',
    },
    button: 'Continuar',
  },
};

function mapStateToProps(state, { roomId }) {
  const { route: { lang }, rooms, apartments, products, booking } = state;
  const room = rooms[roomId];

  if ( !room || room.isLoading ) {
    return { isLoading: true };
  }

  const city = apartments[room.ApartmentId].addressCity;
  const packPrices = Utils.getPackPrices({ products, city });

  return {
    lang,
    roomId,
    room: { ...room, name: Utils.localizeRoomName(room.name, lang) },
    booking,
    city,
    packPrices,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingForm);
