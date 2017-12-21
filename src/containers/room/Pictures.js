import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import * as actions           from '~/actions';

import style from './style.css';

class Pictures extends PureComponent {

  renderPicture({ url, alt, order }) {
    const st = {
      backgroundImage: `url(${url})`,
    };
    return (
      <div style={st}>
        {alt}
      </div>
    );
  }
  render() {
    const {
      lang,
      pictures,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <section className={style.pictures}>
          {pictures.slice(0, 5).map((picture) => this.renderPicture(picture))}
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Photos',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];
  const pictures = [].concat(...[
    (room && room.Pictures || []),
    (apartment && apartment.Pictures || []).filter(({ alt }) => alt !== 'floorPlan'),
  ].map((pics) => pics.sort((a, b) => a.order - b.order)));

  return {
    lang,
    pictures,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
