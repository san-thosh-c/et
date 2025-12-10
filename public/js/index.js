document.addEventListener("DOMContentLoaded", async () => {
  let selectedTripId,
    selectedTripName = null;
  let selectedTheme;
  localStorage.removeItem("selectedTripId");
  localStorage.removeItem("selectedTripName");
  selectedTheme = localStorage.getItem("selectedTheme");
  const addBtn = document.getElementById("addparticipants");
  const addtripBtn = document.getElementById("addtrip");
  const backBtn = document.getElementById("back");
  const tripContainer = document.getElementById("trip-container");
  const activity = document.getElementById("activity");
  const account = document.getElementById("account");
  const popupTrip = document.getElementById("trippopupForm");
  const tavNav = document.getElementById("tabNavigation");
  activity.style.display = "none";
  backBtn.style.display = "none";

  const darkIcon = document.getElementById("dark");
  const lightIcon = document.getElementById("light");
  const body = document.body;

  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme === "dark-theme") {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    darkIcon.style.display = "none";
    lightIcon.style.display = "inline-block";
  } else {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
    darkIcon.style.display = "inline-block";
    lightIcon.style.display = "none";
  }

  darkIcon.addEventListener("click", () => {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    darkIcon.style.display = "none";
    lightIcon.style.display = "inline-block";
    localStorage.setItem("selectedTheme", "dark-theme");
  });

  lightIcon.addEventListener("click", () => {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
    darkIcon.style.display = "inline-block";
    lightIcon.style.display = "none";
    localStorage.setItem("selectedTheme", "light-theme");
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      console.log(tab.textContent.trim());
      if (tab.textContent.trim() === "Trips") {
        tripContainer.style.display = "grid";
        addBtn.style.display = "none";
        addtripBtn.style.display = "block";
        activity.style.display = "none";
        backBtn.style.display = "none";
      }
      if (tab.textContent.trim() === "Master List") {
        tripContainer.style.display = "none";
        addtripBtn.style.display = "none";
        activity.style.display = "block";
        backBtn.style.display = "block";
        tab.classList.add("active");
        // const url = `../html/masterlist.html?`;
        // window.location.href = url;
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
      // if (trip.tripStatus === "Active") {
      //   card.style.backgroundColor = "#90ee9075";
      // }
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
        const url = `../html/tripdetails.html?tripId=${encodeURIComponent(
          selectedTripId
        )}&tripName=${encodeURIComponent(selectedTripName)}`;
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
    addBtn.style.display = "none";
    addtripBtn.style.display = "block";
    activity.style.display = "none";
    account.style.display = "none";
    backBtn.style.display = "none";
    // tripDetails.style.display='none';
    tavNav.style.display = "flex";
  };

  addtripBtn.onclick = () => {
    popupTrip.style.display = "flex";
    popupTrip.style.zIndex = "1";
  };

  window.closeTripForm = function () {
    popupTrip.style.display = "none";
  };

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
          card.className = "trip-card";
          card.dataset.tripid = trip._id;
          card.dataset.tripname = trip.tripname;
          // if (trip.tripStatus === "Active") {
          //   card.style.backgroundColor = "#90ee9075";
          // }
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
            localStorage.setItem("selectedTheme", selectedTheme);
            const url = `../html/tripdetails.html?tripId=${encodeURIComponent(
              selectedTripId
            )}&tripName=${encodeURIComponent(selectedTripName)}`;
            window.location.href = url;
          });

          // Assemble card
          card.appendChild(cardLeft);
          card.appendChild(cardRight);
          container.appendChild(card);
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
  console.log("dateString =" + dateString);
  if (dateString !== null && dateString !== "" && dateString !== undefined) {
    console.log("1");
    const date = new Date(dateString);
    console.log("date" + date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } else {
    console.log("2");
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
