import { IntlProvider, Text } from 'preact-i18n';
import Card                   from '~/components/Card';

export default function Services({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div className="content service">
        <h1>
          <Text id="title">Services included with your housing</Text>
        </h1>
        <p>
          <Text id="subtitle">
            At Chez Nestor, everything is included: we take care of it all so
            that you don't have to worry about anything and you can enjoy your
            accomodation!
          </Text>
        </p>
        <div className="grid-5 has-gutter-xl">
          {services.map((service) => (
            <Card
              title={service[lang].title}
              content={service[lang].content}
              image={`/assets/services/${service.image}`}
            />
          ))}
        </div>
      </div>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
    title: 'Services inclus avec votre logement',
    subtitle: `
      Chez Nestor, tout est inclus : nous veillons à ce que vous n'ayez à
      vous soucier de rien pour profiter de votre logement !
    `,
  },
  'es-ES': {
    title: 'Servicios incluidos en su alojamiento',
    subtitle: `
      Chez Nestor, todo está incluido : Nos encargamos de todo para que pueda
      disfrutar de tu alojamiento sin tener que preocuparse de nada.
    `,
  },
};

const services = [{
  image: 'wifi.png',
  'en-US': {
    title: 'Wifi',
    content: 'High-speed, unlimited Wi-Fi in your accomodation!',
  },
  'fr-FR': {
    title: 'Wifi',
    content: 'Connexion wifi illimitée et haut débit dans votre logement !',
  },
  'es-ES': {
    title: 'Wifi',
    content: 'Conexión wifi de banda ancha y ilimitada en tu alojamiento!',
  },
}, {
  image: 'electricity.png',
  'en-US': {
    title: 'Electricity',
    content: 'Why wait two weeks in the dark for your electricity provider to come by? Come in, plug in, it\'s ready!',
  },
  'fr-FR': {
    title: 'Électricité',
    content: 'Pourquoi attendre 15 jours dans le noir le passage d\'EDF ? Entrez, branchez, c\'est prêt !',
  },
  'es-ES': {
    title: 'Electricidad',
    content: 'No es necesario esperar a los técnicos de EDF dos semanas en la oscuridad. Entra, conecta  - todo está listo!',
  },
}, {
  image: 'water.png',
  'en-US': {
    title: 'Water',
    content: 'Have a shower and make a cup of tea on your arrival… The water is included.',
  },
  'fr-FR': {
    title: 'Eau',
    content: 'Prenez une douche, faites-vous un thé… dès votre arrivée. L\'eau est incluse.',
  },
  'es-ES': {
    title: 'Agua',
    content: 'Tan pronto como llegue, toma una ducha y preparate un té… Los gastos de agua son incluidos.',
  },
}, {
  image: 'gas.png',
  'en-US': {
    title: 'Gas',
    content: 'Gas for heating and cooking and the compulsory maintenance of your boiler are included!',
  },
  'fr-FR': {
    title: 'Gaz',
    content: 'Chauffage ou cuisinière, le gaz et la révision obligatoire de votre chaudière sont inclus !',
  },
  'es-ES': {
    title: 'Gas',
    content: 'Calefacción o horno, el gas y la revisión obligatoria de su caldera son incluidos!',
  },
}, {
  image: 'repairs.png',
  'en-US': {
    title: 'Repairs',
    content: 'Leaks or malfunctions? Our team will be there as soon as possible - and it\'s free!',
  },
  'fr-FR': {
    title: 'SAV',
    content: 'Fuite, panne... Pas de panique, notre équipe arrive au plus vite. Et c\'est gratuit.',
  },
  'es-ES': {
    title: 'Servicio postventa',
    content: '¿Fuga, avería ? No te preocupes, nuestro equipo interviene lo más rápidamente posible. Y es gratis!',
  },
}, {
  image: 'building.png',
  'en-US': {
    title: 'Building',
    content: 'Elevator, lighting and cleaning of your building… it\'s all included!',
  },
  'fr-FR': {
    title: 'Copro.',
    content: 'Ascenseur, lumière, ménage de l\'immeuble… tout est inclus !',
  },
  'es-ES': {
    title: 'Copropriedad',
    content: 'Ascensor, iluminación, limpieza del edificio… ¡Todo está incluido!',
  },
}, {
  image: 'tax.png',
  'en-US': {
    title: 'Tax',
    content: 'Household Waste Tax? We take care of that too!',
  },
  'fr-FR': {
    title: 'Taxe',
    content: 'La taxe sur les ordures ménagères ? On s\'en occupe aussi !',
  },
  'es-ES': {
    title: 'Impuesto',
    content: '¿El impuesto sobre la retirada de basura? Nosotros también nos encargamos de eso!',
  },
}, {
  image: 'insurance.png',
  'en-US': {
    title: 'Insurance',
    content: 'Comprehensive Home Insurance is included for the accomodation.',
  },
  'fr-FR': {
    title: 'Assurance',
    content: 'Votre assurance multirisque habitation est incluse pour le logement.',
  },
  'es-ES': {
    title: 'Seguro de vivienda',
    content: 'El precio de su seguro multirriesgo de vivienda está incluido para el alojamiento.',
  },
}, {
  image: 'support.png',
  'en-US': {
    title: 'Support',
    content: 'Our team is at your service throughout your stay!',
  },
  'fr-FR': {
    title: 'Assistance',
    content: 'Tout au long de votre séjour, notre équipe est à votre service.',
  },
  'es-ES': {
    title: 'Asistencia',
    content: 'Nuestro equipo está a su disposición a lo largo de su estancia!',
  },
}, {
  image: 'subsidies.png',
  'en-US': {
    title: 'Subsidies',
    content: 'All of our accomodations are eligible for the rent subsidy from the CAF (rent and revenue conditions apply).',
  },
  'fr-FR': {
    title: 'APL',
    content: '100% de nos logements sont éligibles aux APL de la CAF (sous conditions de loyer et revenus).',
  },
  'es-ES': {
    title: 'APL',
    content: 'Todos nuestros alojamiento son elegibles para el subsidio de alquiler (APL) de la CAF (con sujeción a condiciones de arrendamiento and ingresos).',
  },
}, {
  image: 'flexibility.png',
  'en-US': {
    title: 'Flexibility',
    content: 'You have an individual and personalized lease. Your stay is flexible in one of our flatshares!',
  },
  'fr-FR': {
    title: 'Flexibilité',
    content: 'Votre bail est individuel et personnalisé. En colocation chez nous, vous êtes flexible !',
  },
  'es-ES': {
    title: 'Flexibilidad',
    content: 'Tienes un contrato de arrendamiento individual y personalizado. Su estancia es flexible en nuestros pisos compartidos !',
  },
}, {
  image: 'furniture.png',
  'en-US': {
    title: 'Furniture',
    content: 'We have taken great care in furnishing your accomodation tastefully.',
  },
  'fr-FR': {
    title: 'Meubles',
    content: 'Nous avons pris le plus grand soin pour meubler votre logement avec goût.',
  },
  'es-ES': {
    title: 'Muebles',
    content: 'Se ha tomado el máximo cuidado para amueblar su alojamiento con gusto.',
  },
}, {
  image: 'fittings.png',
  'en-US': {
    title: 'Fittings',
    content: 'Washing machine, dishwasher, microwave... You\'re kitted out from top to bottom!',
  },
  'fr-FR': {
    title: 'Équipements',
    content: 'Lave-linge, lave-vaisselle, micro-ondes... Vous êtes équipé(e) du sol au plafond !',
  },
  'es-ES': {
    title: 'Equipamientos',
    content: 'Lavadora, lavavajilla, microondas... ¡Usted está totalmente equipado!',
  },
}, {
  image: 'bedding.png',
  'en-US': {
    title: 'Bedding',
    content: 'Duvet, pillow, sheets... we even give you tempoary bedding for your first night.',
  },
  'fr-FR': {
    title: 'Literie',
    content: 'Couette, oreiller, draps... nous avons même pensé à votre première nuit.',
  },
  'es-ES': {
    title: 'Cama',
    content: 'Edredón, almohada, sábanas... hemos previsto todo para tu primera noche.',
  },
}, {
  image: 'kitchen.png',
  'en-US': {
    title: 'Kitchen',
    content: 'Pots, pans, cutlery, utensils... There is everything you need to cook!',
  },
  'fr-FR': {
    title: 'Vaisselle',
    content: 'Casseroles, poêles, couverts, ustensiles... Tous est là pour vous faire de bons petits plats !',
  },
  'es-ES': {
    title: 'Vajilla',
    content: 'Cazos, sartenes, cubiertos, utensilios... Ponemos a su disposición todo lo necesario para cocinar!',
  },
}];
