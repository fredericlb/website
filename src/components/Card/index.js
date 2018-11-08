import style                  from './style';

export default function Card({ image, title, content }) {
  return (
    <div className={style.card}>
      <img src={image} />
      <h4 className={`like-h2 ${style.cardTitle}`}>{title}</h4>
      <hr className={style.cardRuler} />
      <p className={style.cardContent}>{content}</p>
    </div>
  );
}
