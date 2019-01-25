import {
  IntlProvider,
  MarkupText,
  Text,
}                             from 'preact-i18n';
import Utils                  from '~/utils';
import FeatureList						from '~/components/booking/FeatureList';
import PackPicker							from '~/components/booking/PackPicker';
import ClientInputs			      from '~/components/booking/ClientInputs';

function BookingFormSections({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div>
        <section>
          <h3><Text id="housingPack">Choose Your Housing Pack</Text></h3>
          <br />
          <MarkupText id="presentation" />
          <br /><br />
          <PackPicker />
        </section>

        <section>
          <h3><Text id="detail">Detailed comparison</Text></h3>
          <FeatureList isPriceHidden />
        </section>

        <section>
          <h3><Text id="personal">Personal info</Text></h3>
          <ClientInputs />
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = {
  'en-US': {
    presentation: `
      Choosing a housing pack is necessary to <b>book your accommodation with Chez Nestor</b>.
      You only pay it once, to finalize your booking, and it covers the cost of our service.
      <br /><br />
      Chez Nestor renovates, furnishes, equips and decorates its accommodations. <b>We manage all
      housing services</b>: WiFi, electricity, housing insurance, condominium fees, gas and water,
      maintenance and assistance throughout your stay, as well as providing you with a duvet,
      pillows, temporary bed linen and other essential services like 24/7 check-in for example.
      <br /><br />
      The <b>Comfort</b> and <b>Privilege</b> housing packs can also include extra services of
      your choice such as a food pack, permanent bedding or a private driver from the airport…
    `,
  },
  'fr-FR': {
    housingPack: 'Choisissez Votre Pack Logement',
    presentation: `
      Le Pack Logement correspond au coût de notre service et doit être payé une
      seule fois <b>pour réserver votre chambre dans l’une de nos colocations</b>.
      <br /><br />
      Chez Nestor rénove, meuble et équipe à neuf tous ses logements. Tous vos services (assurance habitation,
      internet haut débit, électricité, check-in 24/7...) sont mis en place par nos équipes afin que <b>votre
      arrivée soit sans efforts dans un logement prêt à vivre</b>. Chez Nestor établit vos contrats individuels,
      et vous offre l’assistance et la maintenance <b>pendant l’intégralité de votre séjour</b>.
      <br /><br />
      Les packs logement <b>Confort</b> et <b>Privilège</b> incluent de nombreux services additionnels
      (chauffeur privé, draps permanents, pack de nourriture…) pour un emménagement plus premium et
      personnalisé.
    `,
    detail: 'Comparaison Détaillée',
    personal: 'Infos personnelles',
  },
  'es-ES': {
    housingPack: 'Elija su Housing Pack',
    presentation: `
      Elegir un housing pack es necesario <b>para reservar tu habitación con Chez Nestor</b>.
      <br /><br />
      Lo pagas una sola vez y corresponde al costo de nuestro servicio.
      <br /><br />
      Chez Nestor renova, amuebla, equipa y decora cada alojamiento. <b>Gestionamos todos los servicios de
      alojamiento</b> (seguro de vivienda, wifi, electricidad, agua...), editamos tus contratos individuales
      y te damos acceso a nuestro equipo de asistencia y mantenimiento del alojamiento y de los
      electrodomésticos para toda tu estancia.
      <br /><br />
      Los housing packs <b>Confort</b> y <b>Privilegio</b> también pueden incluir muchos servicios adicionales
      como un pack de comida, sábanas permanentes, un conductor privado para tu llegada...
    `,
    detail: 'Comparación detallada',
    personal: 'Datos personales',
  },
};

export default Utils.connectLang(BookingFormSections);
