import style                  from './style';

function ItemRow({ item: { label, unitPrice, vatRate, quantity } }) {
  return (
    <tr>
      <td className={`${style.title} text-left`}>{label}</td>
      <td className="text-right">{unitPrice /100}€</td>
      <td className="text-right">{vatRate > 0 ? `${Math.round(vatRate * unitPrice) / 100}€` : ''}</td>
      <td className="text-right">{quantity}</td>
      <td className="text-right">{Math.round(unitPrice * quantity * (1 + vatRate)) / 100}€</td>
    </tr>
  );
}

export default ItemRow;
