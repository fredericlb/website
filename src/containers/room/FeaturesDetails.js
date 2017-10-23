import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import { Button }             from 'react-toolbox/lib/button';
import { IntlProvider }       from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import Promise                from 'bluebird';
import autobind               from 'autobind-decorator';
import ApartmentDetails       from '~/containers/room/ApartmentDetails';
import RoomDetails            from '~/containers/room/RoomDetails';
import Utils                  from '~/utils';
import Features               from '~/components/Features/features';
import * as actions           from '~/actions';

const _ = { capitalize, values, mapValues };
class FeaturesDetails extends PureComponent {
  @autobind
  saveChange(event, value) {
    const { actions, room, apartment } = this.props;

    Promise.resolve()
      .then(() => Promise.all([
        Utils.apartmentSchema.validate(apartment, { abortEarly: false }),
        Utils.roomSchema.validate(room, { abortEarly: false }),
      ]))
      .then(([validApartment, validRoom]) => {
        if ( validApartment && validRoom ) {
          return actions.saveRoomAndApartment(this.props);
        }
        return null;
      })
      .then(() => actions.saveFeatures(this.props));
  }

  @autobind
  handleFeatureChange(value, event) {
    let feature = {};

    ['name', 'taxonomy', 'termable']
      .forEach((attribute) =>
        feature[attribute] = event.target.getAttribute(attribute)
      );
    feature.TermableId = feature.termable === 'Room' ?
      this.props.roomId :
      this.props.apartmentId;

    event.target.checked ?
      feature.termable === 'Room' ?
        this.props.actions.addRoomFeature(feature) :
        this.props.actions.addApartmentFeature(feature) :
      feature.termable === 'Room' ?
        this.props.actions.deleteRoomFeature(feature) :
        this.props.actions.deleteApartmentFeature(feature);
  }

  renderTerm({ termable, taxonomy, name, label, isChecked }) {
    const { admin } = this.props;
    if ( !admin ) {
      return isChecked ? <li>{label}</li> : '';
    }
    return (
      <Checkbox
        checked={isChecked}
        label={label}
        onChange={this.handleFeatureChange}
        name={name}
        taxonomy={taxonomy}
        termable={termable}
      />
    );
  }
  renderFeatures(taxonomy, category) {
    const { lang, admin } = this.props;
    const InitializedFeatures = this.props[`${category}Features`];
    const featuresList = _.values(_.mapValues(Features[category][taxonomy],(value, key, object) => Object.assign(
      object[key],
      {
        termable: category,
        taxonomy,
        name: key,
        label: object[key][lang],
        isChecked: InitializedFeatures.some((feature) => feature.name === key && feature.taxonomy === taxonomy),
      })));
    const displayTitle = admin ? true : !!featuresList.some((feature) => feature.isChecked !== false);

    return (
      featuresList.length > 0 ?
        <section>
          {displayTitle ? <div><h4>{_.capitalize(taxonomy.split('-')[2])}</h4><br /></div> : ''}
          <ul class="grid-4 has-gutter-l">{featuresList.map((term) => this.renderTerm(term))}</ul>
        </section>
        : ''
    );
  }

  render() {
    const {
      lang,
      roomError,
      roomId,
      apartmentId,
      isFeaturesValidated,
      isApartmentFeaturesInitialized,
      isRoomFeaturesInitialized,
      admin,
    } = this.props;

    if ( isRoomFeaturesInitialized === undefined && isApartmentFeaturesInitialized === undefined) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        { admin ?
          <section>
            <RoomDetails roomId={roomId} />
            <h3 style="text-align:center;">Features</h3>
            {['room-features-sleep',
              'room-features-dress',
              'room-features-work',
              'room-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Room'))
            }
            <h2 style="text-align:center;">Details for apartment - {apartmentId}</h2>
            <ApartmentDetails roomId={roomId} apartmentId={apartmentId} />
            <h3  style="text-align:center;">Features</h3>
            {['apartment-features-kitchen',
              'apartment-features-bathroom',
              'apartment-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Apartment'))
            }
            <div style="text-align:center;">
              <Button
                icon="add"
                label="Save Changes"
                raised
                primary
                onClick={this.saveChange}
              />
            </div>
            {roomError && roomError.unauthorized ?
              <div>
                <span>{roomError.unauthorized}<br />
                  <a href="/admin">Login</a> <br />
                  Or <br />
                  <a href={`/${lang}/room/${roomId}`}>Go back</a>
                </span>

              </div>
              : ''
            }
            {isFeaturesValidated ?
              <div>
                <span>Features have been successfully updated on the backoffice</span>
              </div>
              : ''
            }
          </section> :
          <section>
            <h3 style="text-align:center;">Room</h3>
            {['room-features-sleep',
              'room-features-dress',
              'room-features-work',
              'room-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Room'))
            }
            <h3 style="text-align:center;">Apartment</h3>
            {['apartment-features-kitchen',
              'apartment-features-bathroom',
              'apartment-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Apartment'))}
          </section>
        }
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang, admin }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    admin,
    room,
    apartment,
    roomError: room && room.errors,
    isFeaturesValidated: rooms && rooms.isValidated,
    RoomFeatures: room && room.Features,
    ApartmentFeatures: apartment && apartment.Features,
    isApartmentFeaturesInitialized: apartment && apartment.Features && apartment.Features.length > 0,
    isRoomFeaturesInitialized: room && room.Features && room.Features.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesDetails);
