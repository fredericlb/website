import Utils            from '~/utils';
import style            from './style.css';

function Testimonies({ lang }) {
  return (
    <section className={style.testimonies}>
      {definition[lang].map((t, i) => <Testimony {...t} i={i} />)}
      {/* Dirty hack to prevent the last item from being displayed out of the section  */}
      <div style="clear: both" />
    </section>
  );
}

function Testimony({ title, comment, author, i }) {
  return (
    <div className={style.testimony}>
      <img
        src={require(`../../../assets/home/testimony-${i+1}-imageoptim.jpg`)}
        alt=""
      />
      <h3>
        {title}{' '}
        <b>★&nbsp;★&nbsp;★&nbsp;★&nbsp;★</b>
      </h3>

      <p>
        {comment}
      </p>
      <div className="text-bold">
        {author}
      </div>
    </div>
  );
}

const definition = {
  'en-US': [{
    title: 'All happiness!',
    comment: `
      1 year and a half at Chez Nestor, 1 year and a half of happiness!
      The team is super responsive and caring. I'm staying on a great
      experience. :) I recommend it!
    `,
    author: 'Othmane, Employee, 23 years old, Moroccan',
  }, {
    title: 'A quality customer service',
    comment: `
      The accommodation is well equipped and customer service is always
      available. We receive prompt and complete answers.
    `,
    author: 'Paola, Student, 23 years old, Brazilian',
  }, {
    title: 'Well located apartments',
    comment: `
      I managed to find an apartment right next to my school on the Chez
      Nestor site.
    `,
    author: 'Mathieu, Student, 29 years old, French',
  }, {
    title: 'Easy to find accommodation',
    comment: `
      I highly recommend Chez Nestor because they found me a stress-free
      and easy accommodation. My room was clean, comfortable and had everything
      I needed. The Chez Nestor team has always been attentive, helpful and
      understanding.
    `,
    author: 'Hannah, Employee, 22 years old, Australian',
  }],
  'fr-FR': [{
    title: 'Que du bonheur !',
    comment: `
      1 an et demi Chez Nestor, 1 an et demi de bonheur ! L'équipe est super
      réactive et aux petits soins. Je reste sur une belle expérience. :)
      Je recommande !
    `,
    author: 'Othmane, Salarié, 23 ans, Marocain',
  }, {
    title: 'Un service client de qualité',
    comment: `
      Le logement est bien équipé et le service client est toujours disponible.
      On reçoit des réponses rapides et complètes.
    `,
    author: 'Paola, Étudiante, 23 ans, Brésilienne',
  }, {
    title: 'Des appartements bien situés',
    comment: `
      J’ai réussi à trouver un appartement juste à côté de mon école sur le site
      de Chez Nestor.
    `,
    author: 'Mathieu, Étudiant, 29 ans, Français',
  }, {
    title: 'Facile de trouver son logement',
    comment: `
      Je recommande vivement Chez Nestor car ils m’ont trouvé un hébergement sans
      stress et facilement. Ma chambre était propre, confortable et avait tout ce
      dont j'avais besoin. L'équipe de Chez Nestor a toujours été attentive,
      serviable et compréhensive.
    `,
    author: 'Hannah, Salariée, 22 ans, Australienne',
  }],
  'es-ES': [{
    title: '¡ Toda la felicidad !',
    comment: `
      ¡ 1 año y medio en Chez Nestor, 1 año y medio de felicidad ! El equipo es muy
      receptivo y atento. Me estoy quedando en una gran experiencia. :)
      ¡ Lo recomiendo !
    `,
    author: 'Othmane, Empleado, 23 años, Marroquí',
  }, {
    title: 'Un servicio al cliente de calidad',
    comment: `
      El alojamiento está bien equipado y el servicio de atención al cliente está
      siempre disponible. Recibimos respuestas rápidas y completas.
    `,
    author: 'Paola, Estudiante, 23 años, Brasileña',
  }, {
    title: 'Apartamentos bien ubicados',
    comment: `
      Conseguí encontrar un apartamento justo al lado de mi escuela en el sitio
      de Chez Nestor.
    `,
    author: 'Mathieu, Estudiante, 29 años, Francés',
  }, {
    title: 'Alojamiento fácil de encontrar',
    comment: `
      Recomiendo encarecidamente a Chez Nestor porque me han encontrado un alojamiento
      fácil y sin estrés. Mi cuarto estaba limpio, cómodo y tenía todo lo que necesitaba.
      El equipo de Chez Nestor siempre ha sido atento, servicial y comprensivo.
    `,
    author: 'Hannah, Empleada, 22 años, Australiana',
  }],
};

export default Utils.connectLang(Testimonies);
