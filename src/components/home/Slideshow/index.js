import Carousel             from '~/components/Carousel';
import {
  carousel,
  image,
  searchEngineContainer,
}                           from './style.css';

export default function Slideshow({ children }) {
  const images = [
    'Chez-Nestor-Colocation-France',
    'Chez-Nestor-Colocation-Centre-Ville',
    'Chez-Nestor-Colocation-Lyon',
    'Chez-Nestor-Colocation-Paris',
    'Chez-Nestor-Colocation-Lille',
    'Chez-Nestor-Colocation-Toulouse',
    'Chez-Nestor-Colocation-Montpellier',
  ];

  return (
    <div>
      <Carousel lazy autoplay autoplayInterval={4000} fade className={carousel}>
        {images.map((name, i) => (
          <div
            className={image}
            alt={name}
            style={{ backgroundImage: `url(/assets/home/gallery/home-gallery-${i+1}-o.jpg)` }}
          />
        ))}
      </Carousel>
      <div className={searchEngineContainer}>
        {children}
      </div>
    </div>
  );
}
