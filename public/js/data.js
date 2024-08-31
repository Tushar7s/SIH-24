
    document.addEventListener("DOMContentLoaded", async function() {
        // Fetch the next available slot (consider duration e.g., 30 minutes)
        const response = await fetch('/next-available-slot?duration=30');
        const nextAvailableSlot = await response.json();

        const appointmentInput = document.getElementById("appointmentTime");
        appointmentInput.value = nextAvailableSlot.toISOString().slice(0,16);
    });

  