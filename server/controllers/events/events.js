/* eslint-disable no-else-return */
import db from '../../models';
import {
  sendMail, createPaginationInfo, successResponse, failureResponse
} from '../../commonHelpers';
import {
  formatEventData, createEmailBody, getCenter, isCenterBooked
} from './helpers';

const { Event, Center } = db;


export default {
  /**
   * Get all the events of a particular user.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async getAll(req, res) {
    const userId = req.decoded.id;
    const { limit, offset } = res.locals;
    const allEvents = await Event.find(
      { userId },
      null,
      { limit, skip: offset, sort: { _id: -1 } }
    );
    const totalEventsCount = await Event.count({ userId });
    const currentEventsCount = allEvents.length;
    const paginationInfo = createPaginationInfo(
      limit,
      offset,
      currentEventsCount,
      totalEventsCount
    );
    const payload = { paginationInfo, events: allEvents.map(event => formatEventData(event)) };
    return successResponse(res, 'Events successfully retrieved', payload);
  },

  /**
   * Get the events to happen in a particular center.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async getEventsPerCenter(req, res) {
    const centerId = req.params.id;
    const { limit, offset } = res.locals;
    const allEvents = await Event.find(
      { centerId, status: 'allowed' },
      null,
      { limit, skip: offset, sort: { _id: -1 } }
    ).populate('userId', 'email');
    const totalEventsCount = await Event.count({ centerId, status: 'allowed' });
    const currentEventsCount = allEvents.length;
    const paginationInfo = createPaginationInfo(
      limit,
      offset,
      currentEventsCount,
      totalEventsCount
    );
    const payload = {
      paginationInfo, events: allEvents.map(event => formatEventData(event, false, true))
    };
    return successResponse(res, `Events of center with ID ${centerId} successfully retrieved`, payload);
  },

  /**
   * Creates an event.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async create(req, res) {
    const {
      title, description, date, centerid,
    } = res.locals.formattedInputs;
    const userId = req.decoded.id;
    const chosenCenter = await getCenter(Center, centerid);
    if (!chosenCenter) {
      return failureResponse(res, 'The chosen center does not exist', {}, 404);
    } else {
      const centerIsBooked = await isCenterBooked(Event, centerid, date);
      if (centerIsBooked) {
        return failureResponse(res, 'The center has been booked for that date', {});
      } else {
        const newEvent = new Event({
          title,
          description,
          date,
          userId,
          centerId: centerid,
          centerName: chosenCenter.name,
        });
        await newEvent.save();
        const payload = { event: formatEventData(newEvent) };
        return successResponse(res, 'Event created', payload, 201);
      }
    }
  },

  /**
   * Updates an event.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async update(req, res) {
    const {
      title, description, date, centerid,
    } = res.locals.formattedInputs;
    const { event } = res.locals;
    if (centerid && event.centerId.toString() !== centerid) {
      const newChosenCenter = await getCenter(Center, centerid);
      const centerIsBooked = await isCenterBooked(Event, centerid, date);
      if (!newChosenCenter) {
        return failureResponse(res, 'The new chosen center does not exist', {}, 404);
      } else if (centerIsBooked) {
        return failureResponse(res, 'The center has been booked for that date');
      } else {
        event.title = title || event.title;
        event.date = date || event.date;
        event.centerId = newChosenCenter._id;
        event.centerName = newChosenCenter.name;
        event.description = description || event.description;
        await event.save();
      }
    } else {
      event.title = title || event.title;
      event.date = date || event.date;
      event.description = description || event.description;

      await event.save();
    }
    const payload = { event: formatEventData(event) };
    return successResponse(res, 'Event updated', payload);
  },

  /**
   * Cancels an event.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async cancel(req, res) {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate('userId', 'email');
    if (!event) {
      return failureResponse(res, 'Event does not exist', {}, 404);
    } else if (event.status === 'canceled') {
      return failureResponse(res, 'Event already canceled');
    } else {
      event.status = 'canceled';
      await event.save();
    }
    sendMail({
      recipient: event.userId.email,
      subject: 'Your Event Has Been Canceled',
      body: createEmailBody(event.title, event.date),
    });
    const payload = { event: formatEventData(event) };
    return successResponse(res, 'Event canceled', payload);
  },

  /**
   * Deletes an event.
   * @param {Object} req The request object.
   * @param {Object} res The response object.
   * @returns {Object} The response object containing some response data.
   */
  async delete(req, res) {
    const { event } = res.locals;
    await Event.remove({ _id: event._id });
    return successResponse(res, 'Event deleted');
  },
};
