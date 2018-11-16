import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import Utils                  from '~/utils';
import CroppedContainer       from '~/components/room/CroppedContainer';
import * as actions           from '~/actions';
import style                  from './style.css';

const _ = { capitalize };

function ApartmentDescription({ lang, isLoading, apartment, district, floorPlan }) {
  if ( isLoading ) {
    return (
      <div className="content text-center">
        <ProgressBar type="circular" mode="indeterminate" />
      </div>
    );
  }

  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <section>
          <h3 className={style.heading}><Text id="district">District</Text></h3>
          <div className={`grid-10 has-gutter-l ${style.districtContent}`}>
            <div className="one-half">
              <CroppedContainer height={150}>
                <p><b>{district.label}</b></p>
                <div>{district[`description${_.capitalize(lang.split('-')[0])}`]}</div>
              </CroppedContainer>
            </div>
            <div className="one-quarter">
              <CroppedContainer height={150}>
                <p><b><Text id="transports">Transports</Text></b></p>
              </CroppedContainer>
            </div>
            <div className="one-quarter">
              <CroppedContainer height={150}>
                <p><b><Text id="nearbySchool">Nearby Schools</Text></b></p>
                <ul className={style.nearbySchools}>
                  {(district.nearbySchools || '')
                    .replace(/(^|\n)- /g, '\n')
                    .split('\n')
                    .map((school) => (<li>{school}</li>))
                  }
                </ul>
              </CroppedContainer>
            </div>
          </div>
        </section>
      </section>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
    nearbySchool: 'Écoles à proximité',
    district: 'Quartier',
  },
  'es-ES': {
    nearbySchool: 'Escuelas cercanas',
    district: 'Barrio',
  },
};

// function Transport({ apartmentFeatures, lang }) {
//   const transports = ['subway', 'tramway', 'bus', 'rer', 'transilien', 'nearbyBike']
//     .map((name) => ({
//       name,
//       list: (apartmentFeatures || []).filter(({ taxonomy }) =>
//         new RegExp(`transport-${name}`).test(taxonomy)
//       ),
//     }));
//
//   return (
//     <section>
//       {transports.map(({ name, list }) => list.length > 0 ?
//         <div className={'grid-4'}>
//           <h6 className={'one-third'}>{transportName[name][lang]}</h6>
//           <ul className={'two-thirds'}>
//             {list.map((i) => (
//               <div className={style[`transport-${name}`]}>{i.name}</div>
//             ))}
//           </ul>
//         </div>
//         : ''
//       )}
//     </section>
//   );
// }

// const transportName = {
//   subway: { 'fr-FR': 'Métro', 'en-US': 'Subway', 'es-ES': 'Metro' },
//   tramway: { 'fr-FR': 'Tramway', 'en-US': 'Tramway', 'es-ES': 'Tranvía' },
//   bus: { 'fr-FR': 'Bus', 'en-US': 'Bus', 'es-ES': 'Autobús' },
//   rer: { 'fr-FR': 'Rer', 'en-US': 'Rer', 'es-ES': 'Rer' },
//   transilien: { 'fr-FR': 'Transilien', 'en-US': 'Transilien', 'es-ES': 'Transilien' },
//   nearbyBike: { 'fr-FR': 'Vélos', 'en-US': 'Bikes', 'es-ES': 'Bicicletas' },
// };

function mapStateToProps({ route: { lang, roomId }, rooms, apartments, districts }) {
  const apartment = apartments[rooms[roomId].ApartmentId];
  const district = apartment && districts[apartment._DistrictId];
  const floorPlan = apartment &&
    Utils.getPictures(apartment).find(({ alt }) => alt === 'floorplan');

  if ( !apartment || apartment.isLoading || !district || district.isLoading ) {
    return { isLoading: true };
  }

  return {
    lang,
    apartment,
    district,
    apartmentFeatures: Utils.getFeatures(apartment),
    districtFeatures: Utils.getFeatures(district),
    floorPlan,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApartmentDescription);
