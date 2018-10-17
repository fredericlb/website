import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { Button }             from 'react-toolbox/lib/button';
import { Input }              from 'react-toolbox/lib/input';
import { batch }              from 'redux-act';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import _const                 from '~/const';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

const {
  API_BASE_URL,
  SALES_EMAIL,
} = _const;

class CardForm extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;

    batch(
      actions.updatePayment({ [event.target.name]: value }),
      actions.deletePaymentError(event.target.name)
    );
  }

  @autobind
  handleRetry(event) {
    const { actions, orderId } = this.props;

    batch(
      actions.resetPayment(),
      actions.getOrder(orderId), // The balance might have been updated
    );
  }

  render(args) {
    const {
      lang,
      orderId,
      payment: { errors },
      orderBalance,
      orderStatus,
      receiptNumber,
      payment,
      currYear,
    } = args;
    const paymentError = errors.payment;
    const handleRetry = this.handleRetry;

    if ( payment.isValidated || orderBalance >= 0 || /orderPaid/.test(errors.payment) ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <section>
            <div class={payment.isValidated ? 'text-center' : 'handleError'}>
              <h4>
                { payment.isValidated ?
                  <Text id="payment.success">Your payment has succeeded.</Text> :
                  <Text id="errors.paid">This order has already been paid.</Text>
                }
              </h4>
              <br />
              <InvoiceButton {...{ lang, orderId, receiptNumber }} />
            </div>

          </section>
        </IntlProvider>
      );
    }

    if ( errors.payment || orderStatus === 'cancelled' ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <section>
            <Error {...{ paymentError, orderStatus, handleRetry }} />
          </section>
        </IntlProvider>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <Input type="number"
            label={<Text id="card.number">Card Number</Text>}
            name="cardNumber"
            value={payment.cardNumber}
            onChange={this.handleChange}
            error={errors.cardNumber}
          />
          <Input type="text"
            label={<Text id="card.holder">Holder Name</Text>}
            name="holderName"
            value={payment.holderName}
            onChange={this.handleChange}
            error={errors.holderName}
          />
          <p class="grid-3-large-1 has-gutter">
            <Input type="number" min="1" max="12" step="1" maxLength="2"
              label={<Text id="card.expiry.month">Expiry Month</Text>}
              name="expiryMonth"
              value={payment.expiryMonth}
              onChange={this.handleChange}
              error={errors.expiryMonth}
            />
            <Input type="number" min={currYear} max={currYear + 10} step="1" maxLength="2"
              label={<Text id="card.expiry.year">Expiry Year</Text>}
              name="expiryYear"
              value={payment.expiryYear}
              onChange={this.handleChange}
              error={errors.expiryYear}
            />
            <Input type="number" min="0" max="999" step="1" maxLength="3"
              label={<Text id="card.cvv">CVV</Text>}
              name="cvv"
              value={payment.cvv}
              onChange={this.handleChange}
              error={errors.cvv}
            />
          </p>
        </section>
      </IntlProvider>
    );
  }
}

function Error({ orderStatus, paymentError }) {
  let errorMessage;
  let canRetry;

  if ( orderStatus === 'cancelled' || /orderCancelled/.test(paymentError) ) {
    errorMessage =
      <Text id="errors.orderCancelled">This order has been cancelled.</Text>;
  }
  else if ( /roomUnavailable/.test(paymentError) ) {
    errorMessage =
      <Text id="errors.roomUnavailable">This room is no longer available.</Text>;
  }
  else if ( /balanceMismatch/.test(paymentError) ) {
    errorMessage = (
      <Text id="errors.balanceMismatch">
        The price of this order has been updated.
        Please check the updated price and try again.
      </Text>
    );
    canRetry = true;
  }
  else if ( /rentingPriceMismatch/.test(paymentError) ) {
    errorMessage = (
      <Text id="errors.rentingPriceMismatch">
        The price of the renting associated with this order has been updated.
        Please go back to your updated booking summary before trying again.
      </Text>
    );
    canRetry = true;
  }
  else if ( /cardExpired/.test(paymentError) ) {
    errorMessage = (
      <Text id="errors.cardExpired">
        This card appears to have expired.
      </Text>
    );
    canRetry = true;
  }
  else if ( /(doNotHonor|unauthorized|tooManyAttempts|amountLimit)/.test(paymentError) ) {
    errorMessage = (
      <span>
        <Text id="errors.doNotHonor">The payment has been declined by your bank.</Text><br />
        <i>code: {paymentError}</i>
      </span>
    );
    canRetry = true;
  }
  else {
    errorMessage = (
      <span>
        <Text id="errors.unexpected">An unexpected error has occured.</Text><br />
        <i>code: {paymentError}</i>
      </span>
    );
    canRetry = true;
  }

  return (
    <div class="handleError">
      <h4>{errorMessage}</h4><br />
      <span>
        { !canRetry ? '' : (
          <Button raised primary
            label={<Text id="errors.retry">Retry</Text>}
            onClick={this.props.handleRetry}
          />
        )}
        {' '}
        <Button raised primary
          label={<Text id="errors.support">Contact Support</Text>}
          href={`mailto:${SALES_EMAIL}`}
          target="_blank"
        />
      </span>
    </div>
  );
}

function InvoiceButton({ lang, orderId, receiptNumber }) {
  const url = `${API_BASE_URL}/actions/pdf-invoice/invoice-${receiptNumber}.pdf`;
  const params = `orderId=${orderId}&lang=${lang}`;

  return (
    <Button raised primary
      label={<Text id="downloadInvoice">Download your invoice</Text>}
      href={`${url}?${params}`}
      target="_blank"
    />
  );
}

function mapStateToProps({ route: { lang }, orders, payment }) {
  const { orderId } = payment;
  const order = orders[orderId];

  return {
    lang,
    payment,
    orderId: order && order.id,
    orderBalance: order && order.balance,
    receiptNumber: order && order.receiptNumber,
    orderStatus: order && order.status,
    currYear: Utils.getCurrYear(),
  };
}

const definition = {
  'fr-FR': {
    errors: {
      paid: 'Cette facture a déjà été payée',
      orderCancelled: 'Cette facture a été annulée',
      doNotHonor: 'Le paiement a été refusé par votre banque.',
      roomUnavailable: 'Cette chambre n\'est plus disponible.',
      balanceMismatch: `
        Le prix de cette facture a été modifié.
        Merci de vérifier le nouveau prix et de retenter le paiement.
      `,
      detailsMismatch: `
        Les détails de cette facture ont été modifiés.
        Merci de rafraîchir la page ou de retourner à votre récapitulatif de
        commande pour prendre connaissance de modifications avant de
        retenter le paiement.
      `,
      cardExpired: 'Cette carte semble avoir expiré.',
      unexpected: 'Une erreur inatendue est survenue.',
      retry: 'Réessayer',
      support: 'Contacter le support',
    },
    payment: {
      success: 'Votre paiement a bien été effectué.',
    },
    card: {
      number: 'Numéro de carte bleue',
      holder: 'titulaire de la carte bleue',
      expiry: {
        month: 'mois d\'expiration',
        year: 'année d\'expiration',
      },
      cvv: 'cryptogramme',
    },
    downloadInvoice: 'Télécharger votre facture',
  },
  'es-ES': {
    errors: {
      paid: 'Esta factura ya ha sido pagada',
      orderCancelled: 'Esta factura ha sido anulada',
      doNotHonor: 'El pago ha sido rechazado por su banco.',
      roomUnavailable: 'Esta habitación ya no está disponible.',il semble que
      balanceMismatch: `
        El precio de esta factura ha sido modificado.
        Por favor, compruebe el nuevo precio e intente pagar de nuevo.
      `,
      detailsMismatch: `
        Los detalles de esta factura han sido modificados.
        Por favor, actualice la página o regrese a su resumen del pedido
        para tener conocimiento de cambios antes de intentar pagar de nuevo.
      `,
      cardExpired: 'Parece que esta tarjeta ha caducado.',
      unexpected: 'Se ha producido un error inesperado.',
      retry: 'Inténtalo de nuevo',
      support: 'Póngase en contacto con el servicio de asistencia',
    },
    payment: {
      success: 'Su pago ha sido efectuado.',
    },
    card: {
      number: 'Número de tarjeta de crédito',
      holder: 'titular de la tarjeta de crédito',
      expiry: {
        month: 'mes de caducidad',
        year: 'año de caducidad',
      },
      cvv: 'criptograma',
    },
    downloadInvoice: 'Descargar su factura',
  },
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardForm);
