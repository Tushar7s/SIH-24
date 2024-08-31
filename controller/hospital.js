const Hospital = require("../models/hospital.js");

module.exports.getHomePage = async (req, res) => {
  try {
    const hospital = await Hospital.find({}); // Wait for the promise to resolve
    console.log(hospital);
    res.render("index", { hospital }); // Pass the resolved data to the template
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the data.");
  }
};


module.exports.getHospitalPage = async (req, res) => {
  res.render("hospital.ejs");
};

module.exports.getSpecialist = async (req, res) => {
  res.render("specialist.ejs");
};

module.exports.getForm = async (req, res) => {
  res.render("NEW.ejs");
};

module.exports.getMedicine = async(req, res) => {
    res.render("medicine.ejs");
}

module.exports.getPostForm = async (req, res) => {
  try {
    // Find the hospital document for the current user (admin)
    let hospital = await Hospital.findOne({ admin: req.user.id });
    if (!hospital) {
      // Create a new hospital document if it doesn't exist
      const newHospital = new Hospital({
        patient: [
          {
            name:"Stephen",
            age: 23,
            gender: "male",
            date: new Date(),
          },
        ],
        opd: 5,
        beds: 2,
        admin: req.user.id, // Associate the new hospital with the admin
      });
      
      await newHospital.save();
      console.log("New hospital created and saved");
      // Redirect to the homepage
      return res.redirect("/portal");
    }
    hospital.opd -= 1;
    hospital.beds -= 1;
    // If hospital exists, add a new patient to it
    let curr_opd = hospital.opd;
    let curr_bed = hospital.beds;
    hospital.patient.push({
      name:"Stephen",
      age: 23,
      gender: "male",
      date: new Date(),
    });
    hospital.opd = curr_opd - 1;
    hospital.beds = curr_bed - 1;
    await hospital.save();
    console.log("Patient added to existing hospital");

    // Redirect to the homepage
    res.redirect("/portal");
  } catch (error) {
    console.error("Error saving hospital data:", error);
    return res.status(400).send("Failed to save hospital data");
  }
};

module.exports.postMedicine = async (req, res) => {
  try {
    // Find the hospital document for the current user (admin)
    let hospital = await Hospital.findOne({ admin: req.user.id });
    if (!hospital) {
      // Create a new hospital document if it doesn't exist
      const newHospital = new Hospital({
        medicine: [
          {
            code: "1XS2",
            name: "Paracetamol",
            category: "Fever",
            drugs: "DimethylAmineoxalate",
            stock: 1000,
            expiry: new Date("2025-08-31T14:30:00Z"),
          },
        ],
        admin: req.user.id, // Associate the new hospital with the admin
      });

      await newHospital.save();
      console.log("New hospital created and saved");
      // Redirect to the homepage
      return res.redirect("/portal");
    }

    // If hospital exists, add a new patient to it
    let curr_opd = hospital.opd;
    let curr_bed = hospital.beds;
    hospital.medicine.push({
      code: "1XY23XX",
      name: "Disprin",
      category: "Headache",
      drugs: "Diethylether",
      stock: 500,
      expiry: new Date("2026-08-31"),
    });
    await hospital.save();
    console.log("medicine added to existing hospital");
    res.redirect("/portal");
  } catch (error) {
    console.error("Error saving hospital data:", error);
    return res.status(400).send("Failed to save hospital data");
  }
};

module.exports.getData = async (req, res) => {
  const hospital = await Hospital.findOne({ admin: req.user.id });
  res.render("data.ejs", { hospital });
};

module.exports.deletePatient = async (req, res) => {
    try {
        const { hospitalId, patientId } = req.params; // Assuming you're passing IDs in URL params

        // Find the hospital document
        let hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).send("Hospital not found");
        }

        // Find the index of the patient to be removed
        const patientIndex = hospital.patient.findIndex(p => p._id.toString() === patientId);
        if (patientIndex === -1) {
            return res.status(404).send("Patient not found");
        }

        // Remove the patient from the array
        hospital.patient.splice(patientIndex, 1);
        hospital.beds += 1;
        hospital.opd += 1;
        // Save the updated hospital document
        await hospital.save();
         
        console.log("Patient removed successfully");
        
        res.redirect("/portal"); // Redirect to a relevant page

    } catch (error) {
        console.error("Error removing patient:", error);
        return res.status(400).send("Failed to remove patient");
    }
};