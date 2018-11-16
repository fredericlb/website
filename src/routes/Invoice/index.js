import { PureComponent }      from 'react';
import { IntlProvider, Text } from 'preact-i18n';
import D                      from 'date-fns';
import capitalize             from 'lodash/capitalize';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import OrderDetails           from '~/components/order/OrderDetails';
import Utils                  from '~/utils';
import _const                 from '~/const';
import style                  from './style';

const _ = { capitalize };
const { SUPPORT_EMAIL } = _const;

export default class Invoice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      order: {},
      client: {},
      clientIdentity: {},
      apartment: {},
    };
  }

  componentDidMount() {
    const { orderId, order } = this.props;

    if ( !order ) {
      return Utils.fetchJson(`/Invoice/${orderId}`)
        .then((order) => {
          const itemWithRenting = order.OrderItems.find((item) => ( item.Renting ));

          return this.setState({
            isLoading: false,
            order,
            client: order.Client,
            clientIdentity: order.Client.Metadata.length ?
              JSON.parse(order.Client.Metadata[0].value) : {},
            apartment: itemWithRenting ?
              itemWithRenting.Renting.Room.Apartment : {},
          });
        });
    }
  }

  render({ lang }) {
    const {
      isLoading,
      order,
      client,
      clientIdentity: { address },
      apartment: { addressCity, addressCountry, addressStreet, addressZip },
    } = this.state;

    if ( isLoading ) {
      return (
        <div className="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div className={`invoice-content ${style['invoice-content']}`}>
          <header className={style.logo}>
            <span>
              <img src={require('~/assets/icons/favicon-128.png')} width="128" height="128" />
            </span>
          </header>
          { isLoading ? (
            <div className="content text-center">
              <ProgressBar type="circular" mode="indeterminate" />
            </div>
          ) : (
            <div className="invoice-data">
              <table className={`${style['table-0']} ${style.noborder}`} cellspacing="0" cellpadding="0">
                <tr>
                  <td className={style.title}>Chez Nestor</td>
                  <td>Chez Nestor</td>
                </tr>
                <tr>
                  <td><a href="http://www.chez-nestor.com">www.chez-nestor.com</a></td>
                  <td>15-17 rue Jean Bourgey 69100 Villeurbanne</td>
                </tr>
                <tr>
                  <td><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                  </td>
                  <td>69100, Villeurbanne</td>
                </tr>
                <tr>
                  <td>+33 (0) 972 323 102</td>
                  <td>France</td>
                </tr>
              </table>
              <div className={style['invoice-title']}>
                <p><Text id="title">Invoice</Text> #{order.receiptNumber}</p>
              </div>
              <table className={`${style['table-1']} ${style.noborder}`}>
                <tr>
                  <td className={style.top}><b><Text id="due.date">Due Date</Text></b></td>
                  <td className={style.top}><b><Text id="due.amount">Amount Due</Text></b></td>
                  <td className={style.top}><b><Text id="address.billing">Billing Address</Text></b></td>
                  <td className={style.top}><b><Text id="address.property">Property Address</Text></b></td>
                </tr>
                <tr>
                  <td className="text-left">{D.format(order.dueDate, 'DD/MM/YYYY')}</td>
                  <td className="text-left">{order.amount / 100}€</td>
                  <td>{client.firstName} {client.lastName}</td>
                  <td>{addressStreet ? addressStreet : ''}</td>
                </tr>
                <tr>
                  <td />
                  <td />
                  <td >{address ? `${address.addr_line1} ${address.addr_line2}`: ''}</td>
                  <td>{addressZip && addressCity ? `${addressZip}, ${_.capitalize(addressCity)}` : ''}</td>
                </tr>
                <tr>
                  <td />
                  <td />
                  <td>{address ? `${address.postal}, ${address.city}, ${address.state}`: ''}</td>
                  <td>{addressCountry ? `${_.capitalize(addressCountry)}` : ''}</td>
                </tr>
                <tr>
                  <td />
                  <td />
                  <td>{address ? `${address.country}`: ''}</td>
                  <td />
                </tr>
                <tr>
                  <td className={style.bottom} />
                  <td className={style.bottom} />
                  <td className={style.bottom}>{client.email}</td>
                  <td className={style.bottom} />
                </tr>
              </table>
              <OrderDetails order={order}>
                <p>Conditions</p>
                <p><Text id="conditions">
                  This rent invoice is valid only for the specified time period
                  and annuls any financial obligation. It does not waiver the
                  occupant from earlier unpaid rents and is provided subject
                  to any undergoing legal procedures.
                </Text></p>
              </OrderDetails>
            </div>
          )}
          <footer className={style.footer}>
            <p>Someby | 15-17 rue Jean Bourgey 69100 Villeurbanne | +33 (0)972323102 | hello@chez-nestor.com</p>
            <p>www.chez-nestor.com | SARL au capital de 170.000€ immatriculée au RCS de Lyon</p>
            <p>SIRET n°751570003 00036 | N° de TVA intracommunautaire FR20 751 570 003</p>
          </footer>
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    title: 'Facture',
    address: {
      billing: 'Addresse de facturation',
      property: 'Addresse du bien',
    },
    due: {
      date: 'Date d\'échéance',
      amount: 'Montant dû',
    },
    conditions:
      `La présente quittance ne libère l'occupant que pour la période
      indiquée et annule tout reçu à valoir. Elle n'est pas libératoire des
      loyers antérieurs impayés et est délivrée sous réserve de toutes instances
      judiciaires en cours.`,
  },
  'es-ES': {
    title: 'Factura',
    address: {
      billing: 'Dirección de facturación',
      property: 'Dirección del inmueble',
    },
    due: {
      date: 'Fecha de vencimiento',
      amount: 'Importe adeudado',
    },
    conditions: `
      El presente recibo de pago de arrendamiento solo libera el ocupante para el período especificado
      y anula todo recibo exigible.
      No se acompaña de ningún carácter liberatorio en cuanto a los alquileres anteriores pendientes
      y será entregada sin perjuicio de todo procedimiento judicial en curso.
    `,
  },
};
