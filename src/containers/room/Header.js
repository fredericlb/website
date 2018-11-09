import { Component }          from 'preact';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import { Button }             from 'react-toolbox/lib/button';
import Portal                 from 'preact-portal';
import Carousel               from '~/components/Carousel';
import style                  from '~/containers/room/style.css';

class Header extends Component {
  @autobind
  handleScroll() {
    // This function will never get called server-side
    let $el = document.getElementById('bookBtn');
    if ( $el !== null ) {
      const maxPos = $el.offsetTop + window.innerHeight;
      const showBookBtn = Utils.getDocumentScrollTop() > maxPos;
      if (this.state.showBookBtn !== showBookBtn) {
        this.setState({ showBookBtn });
      }
    }
    $el = document.getElementById('room-anchors');
    if ( $el !== null ) {
      const maxPos = $el.offsetTop + window.innerHeight;
      const showLinks = Utils.getDocumentScrollTop() > maxPos;
      if (this.state.showLinks !== showLinks) {
        this.setState({ showLinks });
      }
    }
  }

  @autobind
  hideSlideshow() {
    this.setState({ showSlideshow: null });
  }

  @autobind
  showGallery(e) {
    e.stopPropagation();
    this.setState({ showSlideshow: 'gallery' });
  }

  @autobind
  showFloorPlans(e) {
    e.stopPropagation();
    this.setState({ showSlideshow: 'floorplans' });
  }


  constructor(props) {
    super(props);
    this.state = {
      showBookBtn: false,
      showSlideshow: null,
      libSpyScroll: null,
      showLinks: false,
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

  componentDidMount() {
    typeof window !== 'undefined' &&
      window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    typeof window !== 'undefined' &&
      window.removeEventListener('scroll', this.handleScroll);
  }

  render({ lang, pictures, roomName, roomId, floorplans, virtualVisitUrl }) {
    const localStyle = pictures.length ?
      { backgroundImage: `url(${pictures[0].url})` } :
      {};
    const btnState =  this.state.showBookBtn ?
      style.fixedHeaderShown :
      style.fixedHeaderHidden;
    let AnchorLink = 'a';

    if ( this.state.libSpyScroll ) {
      AnchorLink = this.state.libSpyScroll.AnchorLink;
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          {this.state.showLinks ? (
            <div className={[style.links, style.fixedLinks].join(' ')}>
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
          ): null }
          {this.state.showSlideshow != null ? (
            <Portal into="body">
              <div className={style.carouselOverlay} onClick={this.hideSlideshow}>
                <div className={style.carouselClose}>×</div>
                {this.state.showSlideshow === 'gallery' && (
                  <Carousel lazy slide arrows className="slideshow-full">
                    {pictures.map(({ url }) =>
                      <div className={style.slideshowImg} style={`background-image: url(${url})`} />
                    )}
                  </Carousel>
                )}
                {this.state.showSlideshow === 'floorplans' && (
                  <Carousel lazy slide arrows className="slideshow-full">
                    {floorplans.map(({ url }) => (
                      <div
                        className={style.slideshowImg}
                        style={`background-image: url(${url})`}
                        title={definition[lang].floorplanDisclaimer}
                      />
                    ))}
                  </Carousel>
                )}
                <div className={style.slideshowSwitch}>
                  <span
                    onClick={this.showGallery}
                    className={this.state.showSlideshow === 'gallery' ? style.selected : null}
                  >
                    <Text id="gallery">Gallery</Text>
                  </span>
                  {floorplans.length > 0 && (
                    <span
                      onClick={this.showFloorPlans}
                      className={this.state.showSlideshow === 'floorplans' ? style.selected : null}
                    >
                      <Text id="floorplans">Floor Plans</Text>
                    </span>
                  )}
                  {virtualVisitUrl && (
                    <a href={virtualVisitUrl} target="_blank">
                      <Text id="virtualVisit">3D viewing</Text> 🗗
                    </a>
                  )}
                </div>
              </div>
            </Portal>
          ) : ''}
          <div className={`${style.fixedHeader} ${btnState}`}>
            <Button href={`/${lang}/booking/${roomId}`}
              raised primary id="bookBtn" style="width: 100%"
            >
              <Text id="book">Book this accomodation</Text>
            </Button>
          </div>
          <section className={style.coverPicture} style={localStyle}>
            <div className={style.coverPictureRoomName}>{ roomName }</div>
            <Button className={style.allPicsBtn} onClick={this.showGallery}>
              <Text id="galery">See all pictures</Text>
            </Button>
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    book: 'Réserver ce logement',
    galery: 'Voir toutes les photos',
    virtualVisit: 'Visite 3D',
    floorplans: 'Plans',
    gallery: 'Galerie',
    floorplanDisclaimer: `
      Note : les surfaces des chambres comprennent toutes les surfaces
      privatives au sol (placard, balcon, sous-pente...).
    `,
  },
  'en-US': {
    book: 'Book this accomodation',
    galery: 'See all pictures',
    virtualVisit: '3D Visit',
    floorplans: 'Plans',
    gallery: 'Gallery',
    floorplanDisclaimer: `
      Note: All surface (closet, balcony, area under slope...) is taking into
      account in the surface area of each room.
    `,
  },
  'es-ES': {
    book: 'Reservar este alojamiento',
    galery: 'Ver todas las fotos',
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
    floorplans,
    virtualVisitUrl,
    lang,
    pictures,
    roomId,
    roomName: Utils.localizeRoomName(room.name, lang),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
