import  vine  from '@vinejs/vine';

export const bookingSchema = vine.object({
    name: vine.string().minLength(4),
    email: vine.string().email(),
    phone_number: vine.number().min(10),
    message: vine.string().minLength(10),
    package_id: vine.string()
});

export const contactSchema = vine.object({
    name: vine.string().minLength(4),
    email: vine.string().email(),
    phone_number: vine.number().min(10),
    message: vine.string().minLength(10),
});

export const flightsSchema = vine.object({
    name: vine.string().minLength(4),
    email: vine.string().email(),
    phone_number: vine.number('The date field must be a number'),
    date: vine.string(),
    origin: vine.string(),
    destination: vine.string(),
    traveler: vine.number(),
    children: vine.number(),
    message: vine.string().minLength(10, 'message should be 10 characters long')
});

export const QUERY_FORM_UNTI_TAG='query_unit_tag_9630'
export const FLIGHT_FORM_UNTI_TAG='flight_unit_tag_8520'
export const BOOKINGS_FORM_UNTI_TAG='booking_unit_tag_7410'


 
 

