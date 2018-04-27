import Utils from '~/utils';

/* eslint-disable indent */
export default { 'en-US': [
  ['My arrival'],
  ['Welcome Bag', 'Transport map, welcome gifts…',                    1, 1, 1],
  ['Pillow & duvet', 'Provided during your stay',                     1, 1, 1],
  ['Disposable bed linen', 'Fitted sheet, pillow cases & duvet cover for your first nights',
                                                                      1, 1, 1],
  ['Permanent bed linen', 'Fitted sheet, pillow cases & duvet cover for your whole stay',
                                                                  '49€', 1, 1],
  ['Bath towel', 'Large (150x100cm), for your whole stay',        '15€', 1, 1],
  ['Food pack', 'Tea, juice, water, Cola, crackers, soup rice, pasta, sauce, salt, dessert, soap.',
                                                                  '49€', 1, 1],
  ['Home delivery', 'Of your permanent bed linen, bath towel and foodpack',
                                                                  '49€', 1, 1],
  ['Check-in self-service 24/7', 'Collect your keys from the key safe at our agency',
                                                                      1, 1, 1],
  ['Check-in at home, opening hours', 'Monday to Friday, 9am to 6pm (except bank holidays)',
                                                                  '79€', 1, 1],
  ['Check-in at home24/7', 'Evenings, nights, weekends, bank holidays',
                                                             '149€', '79€', 1],
  ['Cancellation insurance', '80% refund of the pack (delay before the reservation starts)',
                                                        0, '1 month', '1 week'],
  ['Luggage service', 'Travel hands free, drop your luggage at our agency (2 for 10 days max)',
                                                                 '129€', 1, 1],
  ['Public transport ticket x2', 'Valid on all lines (metro, tram, bus)',
                                                                      0, 1, 1],
  ['private driver', 'From airport/train station to your home',       0, 0, 1],
  ['Neighborhood tour', 'Supermarkets, transports, restaurants…',     0, 0, 1],
  ['My paperwork'],
  ['Services activation', 'Housing insurance, assistance, wifi, water, gas, electricity…',
                                                                      1, 1, 1],
  ['Customized individual lease', 'Even in a flatshare, independance & flexibility',
                                                                      1, 1, 1],
  ['Customized individual inventory', 'Even in a flatshare, independance and flexibility',
                                                                      1, 1, 1],
  ['My stay'],
  ['Unlimited assistance', 'During your whole stay',                  1, 1, 1],
  ['24/7 emergency assistance', 'In case of emergency',               1, 1, 1],
  ['Unlimited maintenance', 'Technical issues and breakdowns',        1, 1, 1],
  ['Maintenance reactivity', 'Maximum delay before 1st reply',
                                                          '72h', '48h', '48h'],
  ['Unlimited keys assistance', 'In case of loss or theft, loan a spare set of keys',
                                                                  '49€', 1, 1],
  ['Dedicated agent', 'Privileged personnalized support',             0, 0, 1],
  ['Accommodation switch', '1st change of accomodation/room in the same city',
                                                        '290€', '190€', '90€'],
  ['My departure'],
  ['Check-out at home', 'Our team meets you at home',                 1, 1, 1],
  ['Checkout 24/7', 'Evenings, nights, weekends, bank holidays included',
                                                        '149€', '149€', '79€'],
  ['Luggage service', 'Travel hands free, drop your luggage (2 for 10 days max) at our agency',
                                                                 '129€', 1, 1],
  ['Deposit refund', 'Maximum delay (except in case of damages)',
                                              '60 days', '40 days', '20 days'],
  ['Non-cashed deposit option', '(only for French cheque)',
                                        '29€/month', '29€/month', '29€/month'],
  ['Deposit (refunded at the end of your stay)'],
  Utils.getDepositLine('paris'),
  Utils.getDepositLine('lyon'),
  Utils.getDepositLine('montpellier'),
  Utils.getDepositLine('lille'),
  Utils.getDepositLine('toulouse'),

  ['Housing pack'],
  Utils.getPackLine('paris'),
  Utils.getPackLine('lyon'),
  Utils.getPackLine('montpellier'),
  Utils.getPackLine('lille'),
  Utils.getPackLine('toulouse'),
] };
