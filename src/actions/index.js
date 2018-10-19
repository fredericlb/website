import { createAction }         from 'redux-act';
import { createActionAsync }    from 'redux-act-async';
import queryString              from 'query-string';
import map                      from 'lodash/map';
import pick                     from 'lodash/pick';
import capitalize               from 'lodash/capitalize';
import D                        from 'date-fns';
import Utils                    from '~/utils';
import _const                   from '~/const';

const _ = { map, pick, capitalize };
const { RESULTS_PER_PAGE } = _const;

export const updateRoute = createAction('Update route object');
export const updateSearch = createAction('Update search state');
export const addRoomFeature = createAction('add feature to room');
export const deleteRoomFeature = createAction('delete feature from room');
export const addRoomPicture = createAction('add picture to room');
export const deleteRoomPicture = createAction('delete picture from room');
export const updateRoomPicture = createAction('update picture from room');
export const addApartmentFeature = createAction('add feature to apartment');
export const deleteApartmentFeature = createAction('delete feature from apartment');
export const addApartmentPicture = createAction('add picture to apartment');
export const deleteApartmentPicture = createAction('delete picture from apartment');
export const updateApartmentPicture = createAction('update picture from apartment');
export const showInfoSnackbar = createAction('show info snackbar');
export const hideInfoSnackbar = createAction('hide info snackbar');
export const updateSSRStatus = createAction('trigger me once ssr async fetch is done');

export const {
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
} = createFormAction('Booking', Utils.bookingSchema);
export const {
  updateSummary,
  setSummaryErrors,
  deleteSummaryError,
  validateSummary,
} = createFormAction('Summary', Utils.summarySchema);
export const {
  updatePayment,
  setPaymentErrors,
  deletePaymentError,
  validatePayment,
} = createFormAction('Payment', Utils.paymentSchema);
export const resetPayment = createAction('reset payment data and errors');

export const getRoom =
  createActionAsync('get Room by id',
    // We need a list query to use a segment
    (id) => Utils.fetchJson(`/Room?filterType=and&filter[id]=${id}&segment=default`)
      .then(throwIfNotFound('Room', id)),
    { ok: { payloadReducer: reduceRooms } }
  );

export const getPage =
  createActionAsync('get WP Page by slug',
    (slug) => Utils.fetchJson(`${_const.BLOG_URL}/wp-json/wp/v2/pages?slug=${slug}`)
      .then(throwIfNotFound('Page', slug)),
    { ok: { payloadReducer: ({ response }) => response[0] } }
  );

export const [
  getRenting,
  getDistrict,
] = ['Renting', 'District'].map((modelName) => createActionAsync(
  `get ${modelName} by id`,
  (id) => Utils.fetchJson(`/${modelName}/${id}`)
    // No record returned is an error
    .then(throwIfNotFound(modelName,id)),
  { ok: { payloadReducer: ({ response }) => ({
    ...response.data.attributes,
    ...(response.included || []).reduce((attributes, value) => {
      attributes[`${value.type}Id`] = value.id;
      attributes[`_${value.type}`] = value.attributes;
      return attributes;
    }, {}),
  }) } }
) );

export const getI18n =
  createActionAsync('get the banner associated with a MetadatableId, if any',
    ({ id, lang, name }) => Utils.fetchJson([
      '/Metadata?filterType=and',
      `&filter[MetadatableId]=${id}&filter[name]=i18n-${lang}-${name}`,
      '&fields[Metadata]=value',
    ].join('')),
    { ok: { payloadReducer: ({ request: [{ id, lang, name }], response: { data } }) => ({
      key: `${id}-${lang}-${name}`,
      value: data[0] ? data[0].attributes.value : false,
    }) } }
  );

export const getOrder =
  createActionAsync('get Order and associated OrderItems by Order id',
    (id) => Utils.fetchJson(`/OrderItem?filterType=and&filter[OrderId]=${id}`)
      .then(throwIfNotFound('Order', id)),
    {
      noRethrow: true,
      ok: { payloadReducer: ({ request, response: { meta, data, included } }) => ({
        ...( included.find((inc) => inc.type === 'Order').attributes ),
        OrderItems: mapOrderItems(data, request[0]),
      }) },
    }
  );
export const listOrders =
  createActionAsync('list Orders and associated OrderItems',
    ({ rentingId }) => {
      if ( rentingId === undefined ) {
        return Promise.reject('Can only fetch by rentingId for now');
      }

      return Utils.fetchJson(
        `/OrderItem?filterType=and&filter[RentingId]=${rentingId}`
      ).then(throwIfNotFound('Renting', rentingId));
    },
    { ok: { payloadReducer: ({ response: { data, included } }) => ({
      orders: included
        .filter((inc) => inc.type === 'Order')
        .map((order) => ({
          ...order.attributes,
          OrderItems: mapOrderItems(data, order.id),
        }))
        .reduce(arrayToMap, {}),
    }) } }
  );

export const listRooms =
  createActionAsync('List Rooms',
    ({ city, date, page }) => {
      if ( city === undefined ) {
        return Promise.reject('Can only list Rooms by city for now');
      }

      const params = {
        zone: city.replace(/ (\d)er?/g, '$1,').replace(/,$/, '').toLowerCase(),
        // If an arrival date is specified, return rooms available up to 30 days before
        date: date != null ? D.subDays(date, 30).getTime() : date,
        'fields[Room]': 'name,Apartment,availableAt,_currentPrice,floorArea,galery',
        'fields[Apartment]': 'roomCount',
        'page[number]': page || 1,
        'page[size]': RESULTS_PER_PAGE,
        sort: 'Rentings->Events.startDate',
      };
      const qs = queryString.stringify(params, { encode: false });

      return Utils.fetchJson(`/SellableRoom?${qs}`);
    },
    { ok: { payloadReducer: reduceRooms } }
  );

export const saveBooking =
  createActionAsync('save Renting and associated Client in the backoffice',
    ({ room, booking }) => (
      Utils.fetchJson(
        '/actions/public/create-client-and-renting',
        {
          method: 'post',
          body: {
            roomId: room.id,
            pack: booking.pack,
            booking,
          },
        },
      )
    ),
    {
      error: { payloadReducer: ({ error, code }) => {
        if ( /roomUnavailable/.test(error) ) {
          return { errors: { isUnavailable: true } };
        }

        return { errors: { unexpected: error } };
      } },
      ok: { payloadReducer: ({ response }) => (response) },
    },
  );

export const savePayment =
  createActionAsync('save Payment and associated Order in the backoffice',
    (payment, rentingPrice) => {
      const pickKeys =
        'cardNumber,cvv,expiryMonth,expiryYear,holderName,orderId,balance'
          .split(',');
      const body =
        Object.assign(rentingPrice ? { rentingPrice } : {}, _.pick(payment, pickKeys));

      return Utils.fetchJson('/actions/public/create-payment', {
        method: 'post',
        body,
      });
    },
    { error: { payloadReducer: (payload) => {
      const error = JSON.parse(payload.error.message);

      // This is the only line required to deal with the new server errors.
      // We used to have a special treatment for card-data related
      // server-side errors, so that they appeared like client-side validation
      // errors. But this was too much trouble for errors that aren't supposed
      // to happen.
      return { errors: { payment: error.code } };
    } } },
  );

export const addCoupon =
  createActionAsync('add Coupon to order',
    // We need a list query to use a segment
    (args) => Utils.fetchJson(`/actions/add-coupon`, {
      method: 'post',
      body: args,
    })
  );

function throwIfNotFound(modelName, id) {
  return (response) => {
    if (modelName === 'Page' && response.length === 0 ) {
      let error = new Error(`${modelName} ${id} not found`);
      error.isNotFound = true;
      throw error;
    }
    // we used to just check meta.count but it is sometimes wrong
    // (e.g. when we query a room, as we have a hook to modify the select query
    // but not the count one)
    if ( Array.isArray(response.data) && response.data.length === 0 ) {
      let error = new Error(`${modelName} ${id} not found`);
      error.isNotFound = true;
      throw error;
    }

    return response;
  };
}

function createFormAction(formName, schema) {
  return {
    [`update${formName}`]: createAction(`Update ${formName} details`),
    [`set${formName}Errors`]: createAction(`Set ${formName} errors`),
    [`delete${formName}Error`]: createAction(`Delete a specific ${formName} error`),
    [`validate${formName}`]: createActionAsync(
      `Validate ${formName}`,
      (content) => schema.validate(content, { abortEarly: false }),
      { error: { payloadReducer: ({ error }) => (
        error.inner.reduce((errors, error) => {
          errors[error.path] = error.message;
          return errors;
        }, {})
      ) } }
    ),
  };
}

function mapOrderItems(data, orderId) {
  return data
    .filter(({ relationships: { Order } }) => (
      Order.data.id === orderId
    ))
    .map(({ attributes, relationships: { Renting, Product } }) => ({
      ...attributes,
      RentingId: Renting.data && Renting.data.id,
      ProductId: Product.data && Product.data.id,
    }));
}

function reduceRooms({ response: { data = [], included = [], meta: { count } } }) {
  return {
    rooms: data
      .filter((item) => item.type === 'Room')
      .map(({ attributes, relationships }) => ({
        ...attributes,
        ApartmentId: relationships.Apartment.data.id,
        availableAt: attributes.availableAt && new Date(attributes.availableAt),
      }))
      .reduce(arrayToMap, {}),
    apartments: included
      .filter((item) => item.type === 'Apartment')
      .map(({ attributes }) => ({
        ...attributes,
        // The backend now sends the city as _addressCity,
        // this handles backward compatibility
        addressCity: attributes.addressCity || attributes._addressCity,
      }))
      .reduce(arrayToMap, {}),
    count,
  };
}

function arrayToMap(items, item, i) {
  items[item.id] = item;
  return items;
}
