import { IntlProvider, Text } from 'preact-i18n';

export default function Services({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div className="content">
        <h1>
          <Text id="title">About</Text>
        </h1>
      </div>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
    title: 'À propos',
  },
  'es-ES': {
    title: 'Empresa Chez Nestor',
  },
};
