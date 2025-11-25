document.addEventListener("DOMContentLoaded", async () => {
  let selectedTripId,
    selectedTripName = null;
  let selectedTheme;
  // localStorage.clear();
  localStorage.removeItem("selectedTripId");
  localStorage.removeItem("selectedTripName");
  selectedTheme = localStorage.getItem("selectedTheme");
  console.log("selectedTheme=", selectedTheme);
  if (
    selectedTheme !== null &&
    selectedTheme !== undefined &&
    selectedTheme !== ""
  ) {
    document.body.className = "";
    document.body.classList.add(selectedTheme);
  }

  const addBtn = document.getElementById("addparticipants");
  const addtripBtn = document.getElementById("addtrip");
  const backBtn = document.getElementById("back");
  const tripContainer = document.getElementById("trip-container");
  // const tripDetails = document.getElementById('tripdetails');
  const activity = document.getElementById("activity");
  const account = document.getElementById("account");
  const popupTrip = document.getElementById("trippopupForm");
  // const pp_popup = document.getElementById("pp_popupForm");
  const tavNav = document.getElementById("tabNavigation");

  const themeclick = document.getElementById("mapIcon");
  const themesDiv = document.querySelector(".themes");
  // const darkmode = document.getElementById("dark");
  // const lightmode = document.getElementById("light");
  const lavendermode = document.getElementById("lavender");
  // const beigemode = document.getElementById("beige");
  const greenmode = document.getElementById("green");
  // const orangemode = document.getElementById("orange");
  // const greymode = document.getElementById("grey");
  // const brownmode = document.getElementById("brown");

  activity.style.display = "none";
  account.style.display = "none";
  backBtn.style.display = "none";
  addBtn.style.display = "none";
  // tripDetails.style.display='none';

  // darkmode.addEventListener("click", () => {
  //   document.body.className = "";
  //   document.body.classList.add("dark-theme");
  //   localStorage.setItem("selectedTheme", document.body.classList.value);
  //   darkmode.classList.add("toggleclass");
  //   lightmode.classList.remove("toggleclass");
  //   beigemode.classList.remove("selectedthemehighlight");
  //   lavendermode.classList.remove("selectedthemehighlight");
  //   greenmode.classList.remove("selectedthemehighlight");
  //   orangemode.classList.remove("selectedthemehighlight");
  //   greymode.classList.remove("selectedthemehighlight");
  //   brownmode.classList.remove("selectedthemehighlight");
  // });

  // lightmode.addEventListener("click", () => {
  //   document.body.className = "";
  //   document.body.classList.add("light-theme");
  //   darkmode.classList.remove("toggleclass");
  //   lightmode.classList.add("toggleclass");

  //   localStorage.setItem("selectedTheme", document.body.classList.value);
  //   console.log("selectedTheme=>", document.body.classList.value);
  //   beigemode.classList.remove("selectedthemehighlight");
  //   lavendermode.classList.remove("selectedthemehighlight");
  //   greenmode.classList.remove("selectedthemehighlight");
  //   orangemode.classList.remove("selectedthemehighlight");
  //   greymode.classList.remove("selectedthemehighlight");
  //   brownmode.classList.remove("selectedthemehighlight");
  // });

  lavendermode.addEventListener("click", () => {
    document.body.className = "";
    document.body.classList.add("lavender-theme");
    localStorage.setItem("selectedTheme", document.body.classList.value);
    // darkmode.classList.remove("toggleclass");
    // lightmode.classList.add("toggleclass");
    // beigemode.classList.remove("selectedthemehighlight");
    greenmode.classList.remove("selectedthemehighlight");
    // orangemode.classList.remove("selectedthemehighlight");
    // greymode.classList.remove("selectedthemehighlight");
    // brownmode.classList.remove("selectedthemehighlight");
    lavendermode.classList.add("selectedthemehighlight");
  });

  // beigemode.addEventListener("click", () => {
  //   document.body.className = "";
  //   document.body.classList.add("beige-theme");
  //   localStorage.setItem("selectedTheme", document.body.classList.value);
  //   darkmode.classList.remove("toggleclass");
  //   lightmode.classList.add("toggleclass");
  //   lavendermode.classList.remove("selectedthemehighlight");
  //   greenmode.classList.remove("selectedthemehighlight");
  //   orangemode.classList.remove("selectedthemehighlight");
  //   greymode.classList.remove("selectedthemehighlight");
  //   brownmode.classList.remove("selectedthemehighlight");
  //   beigemode.classList.toggle("selectedthemehighlight");
  // });

  greenmode.addEventListener("click", () => {
    document.body.className = "";
    document.body.classList.add("green-theme");
    localStorage.setItem("selectedTheme", document.body.classList.value);
    // darkmode.classList.remove("toggleclass");
    // lightmode.classList.add("toggleclass");
    // beigemode.classList.remove("selectedthemehighlight");
    lavendermode.classList.remove("selectedthemehighlight");
    // orangemode.classList.remove("selectedthemehighlight");
    // greymode.classList.remove("selectedthemehighlight");
    // brownmode.classList.remove("selectedthemehighlight");
    greenmode.classList.add("selectedthemehighlight");
  });

  // orangemode.addEventListener("click", () => {
  //   document.body.className = "";
  //   document.body.classList.add("orange-theme");
  //   localStorage.setItem("selectedTheme", document.body.classList.value);
  //   darkmode.classList.remove("toggleclass");
  //   lightmode.classList.add("toggleclass");
  //   beigemode.classList.remove("selectedthemehighlight");
  //   lavendermode.classList.remove("selectedthemehighlight");
  //   greenmode.classList.remove("selectedthemehighlight");
  //   greymode.classList.remove("selectedthemehighlight");
  //   brownmode.classList.remove("selectedthemehighlight");
  //   orangemode.classList.add("selectedthemehighlight");
  // });

  // greymode.addEventListener("click", () => {
  //   document.body.className = "";
  //   document.body.classList.add("grey-theme");
  //   localStorage.setItem("selectedTheme", document.body.classList.value);
  //   darkmode.classList.remove("toggleclass");
  //   lightmode.classList.add("toggleclass");
  //   beigemode.classList.remove("selectedthemehighlight");
  //   lavendermode.classList.remove("selectedthemehighlight");
  //   greenmode.classList.remove("selectedthemehighlight");
  //   orangemode.classList.remove("selectedthemehighlight");
  //   brownmode.classList.remove("selectedthemehighlight");
  //   greymode.classList.add("selectedthemehighlight");
  // });

  // brownmode.addEventListener("click", () => {
  //   document.body.className = "";
  //   document.body.classList.add("brown-theme");
  //   localStorage.setItem("selectedTheme", document.body.classList.value);
  //   darkmode.classList.remove("toggleclass");
  //   lightmode.classList.add("toggleclass");
  //   beigemode.classList.remove("selectedthemehighlight");
  //   lavendermode.classList.remove("selectedthemehighlight");
  //   greenmode.classList.remove("selectedthemehighlight");
  //   orangemode.classList.remove("selectedthemehighlight");
  //   greymode.classList.remove("selectedthemehighlight");
  //   brownmode.classList.add("selectedthemehighlight");
  // });

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
        // tripDetails.style.display='none';
        addtripBtn.style.display = "block";
        activity.style.display = "none";
        account.style.display = "none";
        backBtn.style.display = "none";
      }
      if (tab.textContent.trim() === "Activity") {
        tripContainer.style.display = "none";
        addBtn.style.display = "none";
        addtripBtn.style.display = "none";
        account.style.display = "none";
        // tripDetails.style.display='none';
        activity.style.display = "block";
        backBtn.style.display = "block";
      }
      if (tab.textContent.trim() === "Account") {
        tripContainer.style.display = "none";
        addBtn.style.display = "none";
        addtripBtn.style.display = "none";
        // tripDetails.style.display='none';
        activity.style.display = "none";
        account.style.display = "block";
        backBtn.style.display = "block";
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

  themeclick.addEventListener("click", function (event) {
    const themesDiv = document.querySelector(".themes");

    themesDiv.style.display = "block";
    event.stopPropagation();
  });

  document.addEventListener("click", function (event) {
    if (!themesDiv.contains(event.target) && event.target !== mapIcon) {
      themesDiv.style.display = "none";
    }
  });

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
