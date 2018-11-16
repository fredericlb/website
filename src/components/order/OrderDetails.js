import { IntlProvider, Text } from 'preact-i18n';
import ItemRow                from '~/components/order/ItemRow';
import Utils                  from '~/utils';
import style                  from './style';

function OrderDetails({ lang, order, children }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <table className={style.itemsTable}>
        <thead>
          <tr>
            <td className="text-left">
              <strong><Text id="item">Item</Text></strong>
            </td>
            <td className="text-right">
              <strong><Text id="unitPrice">Unit Price</Text></strong>
            </td>
            <td className="text-right">
              <strong><Text id="vat">VAT</Text></strong>
            </td>
            <td className="text-right">
              <strong><Text id="quantity">Quantity</Text></strong>
            </td>
            <td className="text-right">
              <strong>Total</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          { order.OrderItems.map((item) => <ItemRow item={item} />) }
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" className={style.conditions}>
              {children}
            </td>
            <th className="text-left">
              <p>
                Total<br />
                <span className={style.smallDetails}>
                  <Text id="incVat">Inc. VAT</Text>
                </span>
              </p>
              <p><Text id="alreadyPaid">Paid</Text></p>
              <p><Text id="balance">Balance</Text></p>
              <p><Text id="status">Status</Text></p>
            </th>
            <th className="text-right">
              <p>
                {order.amount / 100}€<br />
                <span className={style.smallDetails}>
                  {order.taxAmount / 100}€
                </span>
              </p>
              <p>{order.totalPaid / 100}€</p>
              <p>{order.balance / 100}€</p>
              <p>{order.balance < 0 ?
                <Text id="paid">Paid</Text> :
                <Text id="pending">Pending</Text>
              }</p>
            </th>
          </tr>
        </tfoot>
      </table>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
    item: 'Produits',
    unitPrice: 'Prix Unitaire',
    quantity: 'Quantité',
    vat: 'TVA',
    ref: 'Réference de facture',
    incVat: 'Dont TVA',
    alreadyPaid: 'Réglé à ce jour',
    balance: 'Solde',
    status: 'Statut',
    paid: 'Payé',
    pending: 'À payer',
  },
  'es-ES': {
    item: 'Productos',
    unitPrice: 'Precio unitario',
    quantity: 'Cantidad',
    vat: 'IVA',
    ref: 'Referencia de factura',
    incVat: 'IVA',
    alreadyPaid: 'Pagado hasta ahora',
    balance: 'Saldo',
    status: 'Estado',
    paid: 'Pagado',
    pending: 'Pendiente',
  },
};

export default Utils.connectLang(OrderDetails);
