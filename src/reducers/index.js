import { combineReducers }  from 'redux';
import { createReducer }    from 'redux-act';
import memoize              from 'memoize-immutable';
import NamedTupleMap        from 'namedtuplemap';
import pickBy               from 'lodash/pickBy';
import forEach              from 'lodash/forEach';

import {
  updateRoute,
  updateSearch,
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
  saveBooking,
  updatePayment,
  setPaymentErrors,
  deletePaymentError,
  validatePayment,
  updateApartment,
  setApartmentErrors,
  deleteApartmentError,
  validateApartment,
  updateRoom,
  setRoomErrors,
  deleteRoomError,
  validateRoom,
  savePayment,
  getApartment,
  getRoom,
  getDistrict,
  getHouseMates,
  listRooms,
  getOrder,
  listOrders,
  getRenting,
  listPictures,
  listTerms,
  addRoomFeature,
  deleteRoomFeature,
  addRoomPicture,
  deleteRoomPicture,
  updateRoomPicture,
  savePictures,
  addApartmentPicture,
  deleteApartmentPicture,
  updateApartmentPicture,
  addApartmentFeature,
  deleteApartmentFeature,
  saveFeatures,
  saveRoomAndApartment,
}                           from '~/actions';

const _ = { pickBy, forEach };
const noErrors = {};

const routeReducer = createReducer({
  [updateRoute]: (state, payload) => ({
    ...state,
    ...payload,
  }),
}, {});
const searchReducer = createReducer({
  [updateSearch]: (state, payload) => ({
    ...state,
    ...payload,
  }),
}, {});

const bookingReducer = createReducer({
  ...createFormReducer({
    update: updateBooking,
    setErrors: setBookingErrors,
    deleteError: deleteBookingError,
    validate: validateBooking,
  }),
  [saveBooking.request]: (state) => ({
    ...state,
    isSaving: true,
  }),
  [saveBooking.ok]: (state) => ({
    ...state,
    isSaving: false,
    errors: noErrors,
  }),
  [saveBooking.error]: (state, payload) => ({
    ...state,
    isSaving: false,
    errors: payload.errors,
  }),
}, { errors: noErrors });

const paymentReducer = createReducer({
  ...createFormReducer({
    update: updatePayment,
    setErrors: setPaymentErrors,
    deleteError: deletePaymentError,
    validate: validatePayment,
  }),
  [savePayment.request]: (state) => ({
    ...state,
    isSaving: true,
  }),
  [savePayment.ok]: (state) => ({
    ...state,
    isSaving: false,
    isValidated: true,
    errors: noErrors,
  }),
  [savePayment.error]: (state, payload) => ({
    ...state,
    isSaving: false,
    errors: payload.errors,
  }),
}, { errors: noErrors });

const roomsReducer = createReducer({
  ...createGetReducer(getRoom),
  // getRoom returns { rooms, apartments } so it needs a special reducer
  [getRoom.ok]: (state, { rooms }) => ({
    ...state,
    ...rooms,
  }),
  ...createListReducer(listRooms, 'room'),
  [getRenting.ok]: (state, { _Room: room }) => ({
    ...state,
    [room.id]: room,
  }),
  [listRooms.ok]: (state, { rooms }) => ({
    ...state,
    ...rooms,
  }),
  [listTerms.ok]: listOkReducer('Terms'),
  [listPictures.ok]: listOkReducer('Pictures'),
  ...createFeatureReducer({
    addFeature: addRoomFeature,
    deleteFeature: deleteRoomFeature,
    saveFeatures,
  }),
  ...createPictureReducer({
    updatePicture: updateRoomPicture,
    addPicture: addRoomPicture,
    deletePicture: deleteRoomPicture,
    savePictures,
  }),
  ...createRoomApartmentFormReducer({
    update: updateRoom,
    setErrors: setRoomErrors,
    deleteError: deleteRoomError,
    validate: validateRoom,
  }),
  [saveRoomAndApartment.ok]: (state) => ({
    ...state,
    isValidated: true,
  }),
  [saveRoomAndApartment.error]: (state, payload) => ({
    ...state,
    errors: payload,
  }),
}, {});

const apartmentsReducer = createReducer({
  ...createGetReducer(getApartment),
  [getRoom.ok]: (state, { apartments }) => ({
    ...state,
    ...apartments,
  }),
  [listRooms.ok]: (state, { apartments }) => ({
    ...state,
    ...apartments,
  }),
  [listTerms.ok]: listOkReducer('Terms'),
  [listPictures.ok]: listOkReducer('Pictures'),
  [getHouseMates.ok]: (state, { id, HouseMates }) => ({
    ...state,
    [id]: { ...state[id], HouseMates },
  }),
  ...createPictureReducer({
    updatePicture: updateApartmentPicture,
    addPicture: addApartmentPicture,
    deletePicture: deleteApartmentPicture,
    savePictures,
  }),
  ...createFeatureReducer({
    addFeature: addApartmentFeature,
    deleteFeature: deleteApartmentFeature,
    saveFeatures,
  }),
  ...createRoomApartmentFormReducer({
    update: updateApartment,
    setErrors: setApartmentErrors,
    deleteError: deleteApartmentError,
    validate: validateApartment,
  }),
  [saveRoomAndApartment.ok]: (state) => ({
    ...state,
    isValidated: true,
  }),
  [saveRoomAndApartment.error]: (state, payload) => ({
    ...state,
    errors: payload,
  }),
}, {});

const districtsReducer = createReducer({
  ...createGetReducer(getDistrict),
  [listTerms.ok]: listOkReducer('Terms'),
}, {});

const rentingsReducer = createReducer({
  ...createGetReducer(getRenting),
}, {});

const ordersReducer = createReducer({
  ...createGetReducer(getOrder),
  ...createListReducer(listOrders, 'order'),
}, {});

const clientReducer = createReducer({
  [getRenting.ok]: (state, { _Client: client }) => client,
}, {});

const reducers = {

  /* generally modified by the router */
  route: avoidUselessMutations(routeReducer),

  /* generally modified by user-interactions */
  search: avoidUselessMutations(searchReducer),
  booking: avoidUselessMutations(bookingReducer),
  payment: avoidUselessMutations(paymentReducer),

  /* generally modified by interacting with our REST API */
  rooms: roomsReducer,
  apartments: apartmentsReducer,
  districts: districtsReducer,
  rentings: rentingsReducer,
  orders: ordersReducer,
  client: clientReducer,
};

const memoizedIdentity = memoize((state) => ( state ), { cache: new NamedTupleMap() });

const combinedReducers = combineReducers(reducers);

export default function(state = {}, action) {
  return combinedReducers(state, action);
}

export function avoidUselessMutations(reducer) {
  return function(state, action) {
    return memoizedIdentity(reducer(state, action));
  };
}

export function createGetReducer(actionAsync) {
  return {
    [actionAsync.request]: (state, payload) => ({
      ...state,
      [payload]: { isLoading: true },
    }),
    [actionAsync.ok]: (state, payload) => ({
      ...state,
      // exclude related records from attributes
      [payload.id]: _.pickBy(payload, (value, key) => !/^_/.test(key)),
    }),
    [actionAsync.error]: (state, { request, error }) => ({
      ...state,
      [request[0]]: {
        ...state[request[0]],
        isLoading: false,
        error,
      },
    }),
  };
}

export function createListReducer(actionAsync, modelName) {
  return {
    [actionAsync.request]: (state) => ({
      ...state,
      isLoading: true,
      error: false,
    }),
    [actionAsync.ok]: (state, payload) => ({
      ...state,
      isLoading: false,
      error: false,
      ...payload[`${modelName}s`],
    }),
    [actionAsync.error]: (state, payload) => ({
      ...state,
      isLoading: false,
      error: payload,
    }),
  };
}
export function createRoomApartmentFormReducer({ update, setErrors, deleteError, validate }) {
  return {
    [update]: (state, payload) => ({
      ...state,
      [payload.id]: { ...state[payload.id], ...payload },
    } ),
    [setErrors]: (state, payload) => ({
      ...state,
      errors: payload,
    }),
    [deleteError]: (state, payload) => ({
      ...state,
      errors: dissoc(payload, state.errors),
    }),
    [validate.request]: (state) => ({
      ...state,
      isValidating: true,
    }),
    [validate.ok]: (state, { response }) => ({
      ...state,
      ...response.data,
      isValidating: false,
      errors: noErrors,
    }),
    [validate.error]: (state, payload) =>  ({
      ...state,
      isValidating: false,
      errors: payload,
    }),
  };
}

export function createFormReducer({ update, setErrors, deleteError, validate }) {
  return {
    [update]: (state, payload) => ({ ...state, ...payload }),
    [setErrors]: (state, payload) => ({
      ...state,
      errors: payload,
    }),
    [deleteError]: (state, payload) => ({
      ...state,
      errors: dissoc(payload, state.errors),
    }),
    [validate.request]: (state) => ({
      ...state,
      isValidating: true,
    }),
    [validate.ok]: (state, { response }) => ({
      ...state,
      ...response.data,
      isValidating: false,
      errors: noErrors,
    }),
    [validate.error]: (state, payload) =>  ({
      ...state,
      isValidating: false,
      errors: payload,
    }),
  };
}

export function createPictureReducer({ updatePicture, addPicture, deletePicture, savePicture }) {
  return {
    [addPicture]: (state, picture) => ({
      ...state,
      [picture.PicturableId]: {
        ...state[picture.PicturableId],
        Pictures: [...state[picture.PicturableId].Pictures, picture],
      },
    }),
    [updatePicture]: (state, { picture, id }) => ({
      ...state,
      [id]: {
        ...state[id],
        Pictures:
        state[id].Pictures.map((oldPicture) => picture.id === oldPicture.id ? { ...oldPicture, ...picture } : oldPicture),
      },
    }),
    [deletePicture]: (state, picture) => ({
      ...state,
      [picture.PicturableId]: {
        ...state[picture.PicturableId],
        Pictures:
        state[picture.PicturableId].Pictures.filter((oldPicture) => oldPicture.id !== picture.id),
      },
    }),
  };
}

export function createFeatureReducer({ addFeature, deleteFeature, saveFeatures }) {
  return {
    [addFeature]: (state, feature) => ({
      ...state,
      isValidated: false,
      [feature.TermableId]: {
        ...state[feature.TermableId],
        Features: [...state[feature.TermableId].Features, feature],
      },
    }),
    [deleteFeature]: (state, feature) => ({
      ...state,
      isValidated: false,
      [feature.TermableId]: {
        ...state[feature.TermableId],
        Features: state[feature.TermableId].Features.filter((oldFeature) => oldFeature.name !== feature.name || oldFeature.taxonomy !== feature.taxonomy),
      },
    }),
    [saveFeatures.ok]: (state) => ({
      ...state,
      isValidated: true,
    }),
    [saveFeatures.error]: (state, payload) => ({
      ...state,
      errors: payload,
    }),
  };
}

export function listOkReducer(modelName) {
  return (state, payload) => {
    const muted = {};

    _.forEach(payload, (value, key) => {
      if ( key in state ) {
        muted[key] = {
          ...state[key],
          [modelName]: value,
        };
      }
    });

    return Object.keys(muted).length > 0 ? { ...state, ...muted } : state;
  };
}

// delete a property from an object (equivalent to Ramda.dissoc)
function dissoc(propName, object) {
  const clone = { ...object };

  delete clone[propName];

  return clone;
}
