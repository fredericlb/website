import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import {
  footer,
  alertButton,
  terms,
}                             from './style';
import _const from '../../const';

function Footer({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <footer class={footer}>
        <div class="content">
          <h2 class="text-center">
            <img src="/assets/logo370x130.png" alt="Chez Nestor" width="185" />
          </h2>
          <div class="grid-3 has-gutter-xl">
            <nav>
              <h3>Votre colocation</h3>
              <ul>
                {_const.SEARCHABLE_CITIES.map(city => (
                  <li>
                    <a href={`/${lang}/search/${city.name}`}>
                      <Text id="flatshares">Flatshares in </Text>
                      {city.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`/${lang}/services`}>
                    <Text id="services">Included Services</Text>
                  </a>
                </li>
                <li>
                  <a href={`/${lang}/booking-process`}>
                    <Text id="booking-process">Booking Process</Text>
                  </a>
                </li>
              </ul>
            </nav>

            <nav>
              <h3>Nous rencontrer</h3>
              <ul>
                <li>
                  <a href={`/${lang}/about`}>
                    <Text id="about">About Chez Nestor</Text>
                  </a>
                </li>
                <li>
                  <a href="https://career.chez-nestor.com/" target="_blank" rel="noopener noreferrer">
                    <Text id="career">Work with us</Text>
                  </a>
                </li>
                <li>
                  <a href="https://blog.chez-nestor.com/" target="_blank" rel="noopener noreferrer">
                    <Text id="blog">Blog</Text>
                  </a>
                </li>
                <li>
                  <a href="#nogo" onClick={handleClickContact}>
                    Contact
                  </a>
                </li>
              </ul>
              <a href={_const.ALERT_FORM_URL}>
                <div className={alertButton}>
                  <Text id="createAlert">Create alert</Text>
                </div>
              </a>
            </nav>

            <nav>
              <h3>Chez Nestor est partout</h3>
              <ul>
                <li>
                  <a href="https://www.facebook.com/cheznestor/">
                    <img src={require('../../assets/footer/facebook.png')} alt="Facebook" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/chez_nestor">
                    <img src={require('../../assets/footer/twitter.png')} alt="Twitter" />
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/cheznestorfrance/">
                    <img src={require('../../assets/footer/instagram.png')} alt="Instagram" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/10667913/">
                    <img src={require('../../assets/footer/linkedin.png')} alt="LinkedIn" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <p className={terms}>
            © {new Date().getFullYear()} Chez Nestor&nbsp;|&nbsp;
            <a href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view">CGV - CGU - Mentions légales</a>
          </p>
        </div>
      </footer>
    </IntlProvider>
  );
}

function handleClickContact(e) {
  e.preventDefault();

  window.$crisp.push(['do', 'chat:open']);
}

const definition = {
  'fr-FR': {
    services: 'Services Inclus',
    booking: 'Réserver',
    about: 'À propos de Chez Nestor',
    // blog: 'Blog', // no translation needed
    career: 'Travailler Chez Nestor',
    terms: 'CGV et mentions légales',
    flatshares: 'Colocation à',
    createAlert: 'Créer une alerte',
  },
  'es-ES': {
    services: 'Servicios Incluidos',
    booking: 'Reservar',
    about: 'A propósito de Chez Nestor',
    career: 'Trabajar Chez Nestor',
    terms: 'Términos y Condiciones Generales y Avisos Legales',
  },
};

export default Utils.connectLang(Footer);
