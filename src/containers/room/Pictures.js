import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
import Portal                 from 'preact-portal';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import Carousel               from '~/components/Carousel';

import style from './style.css';

const Picture = ({ picture, onClick }) => {
  const st = {
    backgroundImage: `url(${picture.url})`,
  };
  return (
    <div style={st} className={'one-sixth'} onClick={onClick}>
      {picture.alt}
    </div>
  );
};

class Pictures extends PureComponent {
  @autobind
  handleSlideshowClick() {
    this.setState({ showSlideshow: !this.state.showSlideshow });
  }

  @autobind
  handleFloorplansSlideshowClick() {
    this.setState({ showFloorplansSlideshow: !this.state.showFloorplansSlideshow });
  }

  constructor() {
    super();
    this.state = {
      showSlideshow: false,
      showFloorplansSlideshow: false,
    };
  }

  render({ lang, pictures, virtualVisitUrl, floorplans }) {
    let cont = null, portal = null, virtualVisit = null, floorPlanLink = null;

    if (floorplans.length > 0) {
      floorPlanLink = (
        <div className={`${style.imageLinkCont}   picto-plans one-sixth`}
          onClick={this.handleFloorplansSlideshowClick}
        >
          <Text id="floorplans">Floor Plans</Text>
        </div>
      );
    }

    if (virtualVisitUrl != null) {
      virtualVisit = (
        <div className={`${style.imageLinkCont}  picto-visit one-sixth`}>
          <a href={virtualVisitUrl} target="_blank">
            <Text id="virtualVisit">3D viewing</Text>
          </a>
        </div>
      );
    }

    const maxThumbnails = 5 - (floorPlanLink != null ? 1 : 0) - (virtualVisitUrl != null ? 1 : 0);

    if (pictures.length > maxThumbnails) {
      cont = (
        <div className={`${style.imageLinkCont} ${style.picturesCont} picto-photocamera_64px one-sixth`}
          onClick={this.handleSlideshowClick}
        >
          + {pictures.length - maxThumbnails}
        </div>
      );
    }

    if (this.state.showSlideshow) {
      portal = (
        <Portal into="body">
          <div className={style.carouselOverlay} onClick={this.handleSlideshowClick}>
            <div className={style.carouselClose}>×</div>
            <Carousel lazy slide arrows>
              {pictures.map(({ url, alt }) => (
                <div
                  className={style.slideshowImg}
                  style={`background-image: url(${url})`}
                  alt={alt}
                />
              ))}
            </Carousel>
          </div>
        </Portal>
      );
    }
    else if (this.state.showFloorplansSlideshow) {
      portal = (
        <Portal into="body">
          <div className={style.carouselOverlay} onClick={this.handleFloorplansSlideshowClick}>
            <div className={style.carouselClose}>×</div>
            <Carousel lazy slide arrows>
              {floorplans.map(({ url }) => (
                <div
                  className={style.slideshowImg}
                  style={`background-image: url(${url})`}
                  title={definition[lang].floorplanDisclaimer}
                />
              ))}
            </Carousel>
          </div>
        </Portal>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section className={`${style.pictures} grid-12 has-gutter`}>
          {pictures.slice(0, maxThumbnails).map((picture) => (
            <Picture picture={picture} onClick={this.handleSlideshowClick} />
          ))}
          {cont}
          {floorPlanLink}
          {virtualVisit}
          {portal}
        </section>
      </IntlProvider>
    );
  }
}

const definition = {
  'en-US': {
    floorplanDisclaimer: `
      Note: All surface (closet, balcony, area under slope...) is taking into
      account in the surface area of each room.
    `,
  },
  'fr-FR': {
    virtualVisit: 'Visite 3D',
    floorplans: 'Plan',
    floorplanDisclaimer: `
      Note : les surfaces des chambres comprennent toutes les surfaces
      privatives au sol (placard, balcon, sous-pente...).
    `,
  },
  'es-ES': {
    virtualVisit: 'Tour 3D',
    floorplans: 'Planes',
    floorplanDisclaimer: `
      Nota: Toda la superficie (armario, balcón, área bajo pendiente...) se
      tiene en cuenta en la superficie de cada habitación.
    `,
  },
};

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];
  const pictures = []
    .concat(Utils.getPictures(room), Utils.getPictures(apartment))
    .filter(({ alt }) => alt !== 'floorplan');
  const floorplans = []
    .concat(Utils.getPictures(room), Utils.getPictures(apartment))
    .filter(({ alt }) => alt === 'floorplan');
  const { virtualVisitUrl } = room;

  return {
    virtualVisitUrl,
    floorplans,
    lang,
    pictures,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
