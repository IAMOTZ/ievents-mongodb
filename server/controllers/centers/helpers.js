/**
 * Get a single center from the database.
 * @param {Object} centerModel The query interface for centers in the database.
 * @param {Number} centerId The ID of the center.
 * @param {Object} options Query opitons.
 * @returns {Object} The center gotten from the database.
 */
export const getCenter = async (centerModel, centerId, options) => {
  const center = await centerModel.findById(centerId, options);
  return center;
};

/**
 * Map out the dates of from an array of event objects.
 * @param {Array} eventsArray an array of events.
 * @returns {Array} an array of event dates.
 */
export const getDatesFromEvents = eventsArray => (
  eventsArray.map(event => event.date)
);

/**
 * Format the center data to be returned to the user.
 * @param {Object} centerData The raw center data gotten from the database.
 * @returns {Object} The formatted center data.
 */
export const formatCenterData = centerData => (
  Object.assign(
    {},
    {
      id: centerData._id,
      name: centerData.name,
      location: centerData.location,
      details: centerData.details,
      capacity: Number(centerData.capacity),
      price: Number(centerData.price),
      images: centerData.images,
    },
  )
);
