document.addEventListener("DOMContentLoaded", async () => {
    let selectedTripId, selectedTripName = null;
    const addBtn = document.getElementById('addparticipants');
    const addtripBtn = document.getElementById('addtrip');
    const backBtn = document.getElementById('back');
    const tripContainer = document.getElementById('trip-container');
    // const tripDetails = document.getElementById('tripdetails');
    const activity = document.getElementById('activity');
    const account = document.getElementById('account');
    const popupTrip = document.getElementById("trippopupForm");
    const pp_popup = document.getElementById("pp_popupForm");
    const tavNav = document.getElementById("tabNavigation");

    activity.style.display = 'none';
    account.style.display = 'none';
    backBtn.style.display = 'none';
    addBtn.style.display = 'none';
    // tripDetails.style.display='none';


    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            console.log(tab.textContent.trim());
            if (tab.textContent.trim() === 'Trips') {
                tripContainer.style.display = "grid";
                addBtn.style.display = 'none';
                // tripDetails.style.display='none';
                addtripBtn.style.display = 'block';
                activity.style.display = 'none';
                account.style.display = 'none';
                backBtn.style.display = 'none';
            }
            if (tab.textContent.trim() === 'Activity') {
                tripContainer.style.display = 'none';
                addBtn.style.display = 'none';
                addtripBtn.style.display = 'none';
                account.style.display = 'none';
                // tripDetails.style.display='none';
                activity.style.display = 'block';
                backBtn.style.display = 'block';
            }
            if (tab.textContent.trim() === 'Account') {             
                tripContainer.style.display = 'none';
                addBtn.style.display = 'none';
                addtripBtn.style.display = 'none';
                // tripDetails.style.display='none';
                activity.style.display = 'none';
                account.style.display = 'block';
                backBtn.style.display = 'block';
            }
        });
    });

    try {
        const response = await fetch("/api/trips");
        const trips = await response.json();
        console.log("Tripid = ", trips);
        const container = tripContainer;
        container.innerHTML = "";

        trips.forEach((trip) => {
            const card = document.createElement("div");
            card.className = "trip-card";
            card.dataset.tripid = trip._id;
            card.dataset.tripname = trip.tripname;
            if (trip.tripStatus === "Active") {
            card.style.backgroundColor = "#90ee9075";
            }
            if (trip.tripStatus === "Closed") {
            card.style.backgroundColor = "#ffb6c14a";
            }
            const cardLeft = document.createElement("div");
            cardLeft.className = "trip-card-detail";
            cardLeft.innerHTML = `
            <h3>${trip.tripname}</h3>
            <h5>Date: ${trip.tripDate}</h5>
            `;

            const cardRight = document.createElement("div");
            cardRight.className = "trip-card-arrow";
            cardRight.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;

            card.addEventListener("click", () => {
            selectedTripId = card.dataset.tripid;
            selectedTripName = card.dataset.tripname;
            console.log("--->", card.dataset);

            localStorage.setItem("selectedTripId", selectedTripId);
            localStorage.setItem("selectedTripName", selectedTripName);
            const url = `../html/tripdetails.html?tripId=${encodeURIComponent(selectedTripId)}&tripName=${encodeURIComponent(selectedTripName)}`;
            window.location.href = url;
            });

            // Assemble card
            card.appendChild(cardLeft);
            card.appendChild(cardRight);
            container.appendChild(card);

        });
    } catch (err) {
        showNotification("Failed to load trips on app start");
    }    

    backBtn.onclick = () => {
        console.log("311");
        window.location.hash = "#trip";
        tripContainer.style.display = "grid";
        addBtn.style.display = 'none';
        addtripBtn.style.display = 'block';
        activity.style.display = 'none';
        account.style.display = 'none';
        backBtn.style.display = 'none';
        // tripDetails.style.display='none';
        tavNav.style.display = 'flex';
    }

    addtripBtn.onclick = () => {
        popupTrip.style.display = "flex";
        popupTrip.style.zIndex = "1";
    };

    addBtn.onclick = () => {
        pp_popup.style.display = "flex";
        pp_popup.style.zIndex = "1";
        document.getElementById("tripname_PP").value = selectedTripName;
        document.getElementById("guestname").value = "";
        document.getElementById("flatNumber").value = "";
        document.getElementById("noOfAdults").value = "0";
        document.getElementById("noOfKids").value = "0";
        document.getElementById("veg").value = "0";
        document.getElementById("nv").value = "0";
    };

    window.closeTripForm = function () {
        popupTrip.style.display = "none";
    };

    window.closeForm = function(){
        pp_popup.style.display = "none";
    }

    window.submitForm = async function () {
        const guestname = document.getElementById("guestname").value;
        const flatNumber = document.getElementById("flatNumber").value;
        const adults = document.getElementById("noOfAdults").value;
        const kids = document.getElementById("noOfKids").value;
        const noofVeg = document.getElementById("veg").value;
        const noofNonVeg = document.getElementById("nv").value;
        const trip_id = selectedTripId; 
        console.log({ guestname, flatNumber, adults, kids, noofVeg, noofNonVeg, trip_id });
        try {
        const response = await fetch("/addguest", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            guestname,
            flatNumber,
            adults,
            kids,
            noofVeg,
            noofNonVeg,
            trip_id,
            }),
        });

        const result = await response.json();

        if (result.success) {
            showNotification("Guest added successfully!");
        } else {
            showNotification(result.message);
        }
        } catch (err) {
        console.error("Error:", err);
        }
        closeForm();
    }

    window.submitTripForm = async function () {
        const tripname = document.getElementById("tripname").value;
        let tripDate = document.getElementById("tripdate").value;
        const tripStatus = "Active";
        console.log({ tripname });
        console.log({ tripDate });
        tripDate = formatTripDate(tripDate);
        console.log("new date", tripDate);

        try {
        const response = await fetch("/addtrip", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ tripname, tripDate, tripStatus }),
        });

        const result = await response.json();

            if (result.success) {
                showNotification("Trip Created successfully!");
                        const response = await fetch("/api/trips");
                        const trips = await response.json();
                        console.log("Tripid = ", trips);
                        const container = tripContainer;
                        container.innerHTML = "";

                        trips.forEach((trip) => {
                            const card = document.createElement("div");
                            const card1 = document.createElement("div");
                            if(trip.tripStatus === "Active"){
                                card.style.backgroundColor = "#90ee9075";
                            }
                            if(trip.tripStatus === "Closed"){
                                card.style.backgroundColor = "#ffb6c14a";
                            }
                            card.className = "trip-card";
                            card.innerHTML = `<h3>${trip.tripname}</h3>`;
                            card1.className = "trip-card-detail";
                            card1.innerHTML = `<h5>Date: ${trip.tripDate}</h5>`;
                            card.dataset.tripid = trip._id;
                            container.appendChild(card);
                            card.appendChild(card1);
                        });
            } else {
                showNotification("Failed to create Trip");
            }
        } catch (err) {
        console.error("Error:", err);
        }
        closeTripForm();
    };
});

  function showNotification(message, duration = 3000) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, duration);
  }

  function formatTripDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
