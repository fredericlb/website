import fp                     from 'lodash/fp';
import { Component }          from 'react';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Link as NavLink }    from 'react-toolbox/lib/link';
import { AppBar }             from 'react-toolbox/lib/app_bar';
import { Navigation }         from 'react-toolbox/lib/navigation';
import { Drawer }             from 'react-toolbox/lib/drawer';
import appbarTheme            from 'react-toolbox/components/app_bar/theme.css';
import Utils                  from '~/utils';
import SearchForm             from '~/components/SearchForm';
import CreateAlertButton      from '~/components/CreateAlertButton';
import style                  from './style';

const languages = [
  { value: 'en-US', label: '🇺🇸', flag: require('../../assets/flags/en-US.png') },
  { value: 'fr-FR', label: '🇫🇷', flag: require('../../assets/flags/fr-FR.png') },
  { value: 'es-ES', label: '🇪🇸', flag: require('../../assets/flags/es-ES.png') },
];

// https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
function getDocumentScrollTop() {
  if ( typeof window !== 'object' ) {
    return 0;
  }

  return window.scrollY
    || window.pageYOffset
    || document.body.scrollTop + (document.documentElement
      && document.documentElement.scrollTop || 0);
}


class Header extends Component {
  @autobind
  handleToggle() {
    this.setState({ isDrawerActive: !this.state.isDrawerActive });
  }

  @autobind
  handleScroll() {
    this.setState({
      scrollPx: getDocumentScrollTop(),
    });
  }

  isSearchPage() {
    return /\/[^/]*\/search/.test(this.props.path);
  }

  isRoomPage() {
    return /\/[^/]*\/room/.test(this.props.path);
  }

  constructor(props) {
    super(props);

    this.state = {
      isDrawerActive: false,
      scrollPx: getDocumentScrollTop(),
    };
  }

  componentDidMount() {
    typeof window !== 'undefined' && window.document.body.addEventListener('touchmove', this.handleScroll);
    typeof window !== 'undefined' && window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    typeof window !== 'undefined' && window.document.body.removeEventListener('touchmove', this.handleScroll);
    typeof window !== 'undefined' && window.removeEventListener('scroll', this.handleScroll);
  }

  renderLeftPart() {
    const headerIsLite = this.isSearchPage() || this.isRoomPage();
    return (
      <div className={style.headerLeftPart}>
        <AppBarTitle lang={this.props.lang} isLite={headerIsLite} handleToggle={this.handleToggle} />
        <div className={style.headerOptionalPart}>
          { this.isSearchPage() && ( <SearchForm mode="searchpage" /> ) }
          { this.isSearchPage() && ( <CreateAlertButton /> ) }
        </div>
      </div>
    );
  }

  render({ lang, path }) {
    const headerClasses = [
      style.header,
      this.isRoomPage() ? style.headerNotFixed : null,
    ];

    return (
      <IntlProvider definition={definition[lang]}>
        <header className={headerClasses.join(' ')}>
          <div className={[style.wrapper].join(' ')}>
            <AppBar
              title={this.renderLeftPart()}
              flat
              theme={style}
            >
              <AppNavigation
                className="hide-md-down"
                type="horizontal" {...{ lang, path }}
              />
            </AppBar>
          </div>
          <Drawer type="left"
            active={this.state.isDrawerActive}
            onOverlayClick={this.handleToggle}
            theme={{ wrapper: style.drawerWrapper }}
          >
            <AppNavigation type="vertical" {...{ lang, path }} handleToggle={this.handleToggle} />
          </Drawer>
        </header>
      </IntlProvider>
    );
  }
}

function AppBarTitle({ lang, isLite = false, handleToggle }) {
  return (
    <div
      className={[appbarTheme.title, style.titleLite].join(' ')}
      style={{ margin: '0 0 0 -22px', float: 'left' }}
    >
      <div onClick={handleToggle} style={{ color: '#aaa' }} className={style.logo} />
    </div>
  );
}

function AppNavigation({ lang, path, type, className, handleToggle }) {
  return (
    <Navigation className={className} type={type} theme={style}>
      <NavLink href={`/${lang}/`} theme={style} onClick={handleToggle}>
        <Text id="home">Home</Text>
      </NavLink>
      <NavLink  href={`/${lang}/services`} theme={style} onClick={handleToggle}>
        <Text id="included">Included Services</Text>
      </NavLink>
      <NavLink href={`/${lang}/booking-process`} theme={style} onClick={handleToggle}>
        <Text id="booking">Booking</Text>
      </NavLink>
      <a onClick={handleClickContact} theme={style}>
        Contact
      </a>
      {fp.flow(
        fp.filter(({ value }) => lang !== value),
        fp.map(({ value, label, flag }) => (
          <NavLink href={path.replace(/^\/[^/]{0,5}/, `/${value}`)} theme={style} onClick={handleToggle} >
            <img src={flag} alt={label} width="18" />
          </NavLink>
        ))
      )(languages)}
    </Navigation>
  );
}

function handleClickContact() {
  if (typeof window === 'object') {
    window.$crisp.push(['do', 'chat:open']);
  }
}

const definition = {
  'fr-FR': {
    included: 'Services Inclus',
    booking: 'Réserver',
  },
  'es-ES': {
    included: 'Servicios Incluidos',
    booking: 'Reservar',
  },
};

export default Utils.connectLang(Header);
