const Hospital = require("../models/hospital.js");
const Appointment = require("../models/appointment.js");
async function getNextAvailableSlot(req, res, duration) {
    try {
        const selectedDate = new Date(); // Default to today if no date provided
        const startOfDay = new Date(selectedDate.setHours(10, 0, 0, 0)); // 10:00 AM
        const endOfDay = new Date(selectedDate.setHours(17, 0, 0, 0)); // 5:00 PM

        // Fetch all booked appointments for the day
        const bookedAppointments = await Appointment.find({
            status: 'scheduled',
            startTime: { $gte: startOfDay, $lt: endOfDay }
        });

        // Generate all possible slots
        const allSlots = [];
        let slotStart = startOfDay;
        while (slotStart < endOfDay) {
            const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
            allSlots.push({ start: slotStart, end: slotEnd });
            slotStart = slotEnd;
        }

        // Mark slots as booked if they overlap with booked appointments
        const availableSlots = allSlots.map(slot => {
            const isBooked = bookedAppointments.some(appt =>
                (slot.start < appt.endTime && slot.end > appt.startTime)
            );
            return { ...slot, booked: isBooked };
        });

        res.render('appointment', { availableSlots });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).send('Failed to fetch available slots');
    }
}

module.exports.getSlot = async(req, res) => {
    try {
        const duration = parseInt(req.query.duration, 10) || 30; // duration in minutes
        const nextAvailableSlot = await getNextAvailableSlot(req, res, duration);
    } catch (error) {
        res.status(500).send("Error fetching next available slot");
    }
}
module.exports.bookAppointment = async(req, res) => {
    // Check for overlap
    try{
         console.log(req.body);
    const {age, gender, mobile, startTime } = req.body;
    console.log(req.body);
    // Parse startTime to a Date object
    const start = new Date(startTime);
    const minutes = start.getMinutes();
    if (minutes !== 0 && minutes !== 30) {
        return res.status(400).send('Invalid appointment time. Please select a valid 30-minute slot.');
    }
    // Validate the start date
    if (isNaN(start.getTime())) {
        return res.status(400).send('Invalid start time');
    }

    // Calculate end time by adding 30 minutes (30 minutes * 60,000 milliseconds)
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    // Find overlapping appointments
    const overlap = await Appointment.findOne({
        status: 'scheduled',
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
    });

    if (overlap) {
        res.status(400).send('slot is already booked, choose another slot')
        return;
    }

    // Create a new appointment
    const appointment = new Appointment({
        age,
        gender,
        mobile,
        startTime: start,
        endTime: end,
        status: 'scheduled'
    });

    await appointment.save();
    res.redirect('/'); // Redirect to a success page or handle as needed
}catch (error) {
    console.error('Error saving appointment:', error);
    res.status(400).send('Failed to save appointment');
}
}

async function cancelAppointment(appointmentId) {
    // Find and update the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.status === 'cancelled') {
        throw new Error('Appointment not found or already cancelled');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Move subsequent appointments
    const subsequentAppointments = await Appointment.find({
        startTime: { $gt: appointment.endTime },
        status: 'scheduled'
    }).sort('startTime');

    for (let appt of subsequentAppointments) {
        appt.startTime = new Date(appt.startTime.getTime() - (appt.endTime - appointment.startTime));
        appt.endTime = new Date(appt.endTime.getTime() - (appt.endTime - appointment.startTime));
        await appt.save();
    }
}

