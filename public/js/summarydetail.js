document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get("tripId");
  const tripName = urlParams.get("tripName");
  const flatDetails = localStorage.getItem("selectedFamily");
  const theme = localStorage.getItem("selectedTheme");
  document.body.className = "";
  document.body.classList.add(theme);
  //document.getElementById("tripname").innerHTML = tripName + " Summary";
  const backBtn = document.getElementById("summary_back");
  const guestDetails = JSON.parse(flatDetails);
  console.log(theme);

  const showMoreLink = document.getElementById("showmore");
  const cardTable = document.getElementById("card-table");
  document.getElementById("guestname").innerHTML =
    guestDetails.guestName + " Expense Summary";

  showMoreLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (cardTable.style.display === "none") {
      cardTable.style.display = "block";
      showMoreLink.textContent = "Show less";
    } else {
      cardTable.style.display = "none";
      showMoreLink.textContent = "Show more";
    }
  });

  backBtn.onclick = () => {
    const url = `../html/summary.html?tripId=${encodeURIComponent(
      tripId
    )}&tripName=${encodeURIComponent(tripName)}`;
    window.location.href = url;
  };

  try {
    const expense_req = await fetch(`/api/getexpenses/${tripId}`);
    const expenses_res = await expense_req.json();
    const expenses = findexpByGroup(expenses_res, guestDetails.guestId);
    console.log(expenses);

    const labels = expenses.map((exp) => exp.category);
    const dataValues = expenses.map((exp) => exp.amount);
    const colors = [
      "#9D00FF",
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#8BC34A",
      "#FF9800",
      "#808080",
      "#FFD700",
      "#00FF00",
      "#008080",
    ];
    const ctx = document.getElementById("expenseChart").getContext("2d");
    Chart.defaults.font.size = 18;
    if (theme === "dark-theme") {
      Chart.defaults.color = "#fff";
    } else {
      Chart.defaults.color = "#000";
    }
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: colors,
            borderColor: "#000",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Expense Distribution by Category",
            font: { size: 18 },
          },
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed;
                return `₹ ${value.toLocaleString("en-IN")}`;
              },
            },
          },
        },
      },
    });

    const container = document.getElementById("card-container");
    const card = document.createElement("div");
    card.className = "cards";

    const cardTop = document.createElement("div");
    cardTop.className = "cardTop";

    const cardMiddle = document.createElement("div");
    cardMiddle.className = "cardMiddle";

    const cardMiddleLeft = document.createElement("div");
    cardMiddleLeft.className = "cardMiddleLeft";

    const cardMiddleRight = document.createElement("div");
    cardMiddleRight.className = "cardMiddleRight";

    cardMiddleLeft.innerHTML = `<h6>HeadCount: ${guestDetails.headcount}</h6>`;
    cardMiddleRight.innerHTML = `<h6><i class="fa-solid fa-carrot" style="color: green;  margin-right: 5px; font-size: 15px;"></i>${guestDetails.totalVeg} <i class="fa-solid fa-fish-fins" style="color: red;margin-right: 5px; font-size: 15px;transform: rotate(315deg);"></i>${guestDetails.totalNveg}</h6>`;

    const cardBottom = document.createElement("div");
    cardBottom.className = "cardBottom";

    const cardBottomLeft = document.createElement("div");
    cardBottomLeft.className = "cardBottomLeft";

    const cardBottomRight = document.createElement("div");
    cardBottomRight.className = "cardBottomRight";

    cardBottomLeft.innerHTML = `<h6>You Spent: ₹ ${guestDetails.totalpaid.toLocaleString(
      "en-IN"
    )}</h6>`;
    if (guestDetails.toSend === 0) {
      cardBottomRight.innerHTML = `<h6 style="color: green;">Receive: ₹ ${Math.abs(
        Number(guestDetails.toReceive)
      ).toLocaleString("en-IN")}</h6>`;
    } else {
      cardBottomRight.innerHTML = `<h6 style="color: red;">Send: ₹ ${Number(
        guestDetails.toSend
      ).toLocaleString("en-IN")}</h6>`;
    }

    const cardLeft = document.createElement("div");
    cardLeft.className = "cardLeft";
    const cardRight = document.createElement("div");
    cardRight.className = "cardRight";

    cardLeft.innerHTML = `<h5><i class="fa-etch fa-solid fa-user"></i>${guestDetails.guestName}</h5>`;
    cardRight.innerHTML = `<h5><i class="fa-solid fa-house"></i>${guestDetails.flatNumber}</h5>`;

    cardMiddle.appendChild(cardMiddleLeft);
    cardMiddle.appendChild(cardMiddleRight);

    cardTop.appendChild(cardLeft);
    cardTop.appendChild(cardRight);

    cardBottom.appendChild(cardBottomLeft);
    cardBottom.appendChild(cardBottomRight);
    card.appendChild(cardTop);
    card.appendChild(cardMiddle);
    card.appendChild(cardBottom);
    container.appendChild(card);

    /**********************************/

    const cont1 = document.getElementById("card-detail");
    const cardDetails = document.createElement("div");
    cardDetails.className = "cardDetail";

    const cardFirstDetails = document.createElement("div");
    cardFirstDetails.className = "cardInfo";
    console.log("1", guestDetails);
    cardFirstDetails.innerHTML = `<h6>Advance Payments: ₹ ${guestDetails.advance_amt.toLocaleString(
      "en-IN"
    )}</h6>`;

    const cardSecondDetails = document.createElement("div");
    cardSecondDetails.className = "cardInfo";
    console.log("2");
    cardSecondDetails.innerHTML = `
  <h6 style="display: flex; justify-content: space-between; align-items: center;">
    You Spend: ₹ ${guestDetails.spent.toLocaleString("en-IN")}
    <i class="fa-solid fa-eye view-spend" style="cursor: pointer; color: #000; font-size: 18px; left: 60%; position: relative;"></i>
  </h6>
`;

    const eyeIcon = cardSecondDetails.querySelector(".view-spend");

    eyeIcon.addEventListener("click", () => {
      console.log("Eye icon clicked: show spend details");
      document.getElementById("spent_details").style.display = "flex";
      const expenses = findexp(expenses_res, guestDetails.guestId);
      console.log(expenses);

      const cardExpTable = document.getElementById("cardExptable");
      const cardTableDetails = document.createElement("div");
      cardTableDetails.className = "cardExpTable";
      const table = document.createElement("table");
      table.className = "summary-Exptable";
      cardExpTable.innerHTML = "";

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      const headers = ["Category", "Amount"];
      headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      const tbody = document.createElement("tbody");
      expenses.forEach((exp) => {
        const tr = document.createElement("tr");
        const tdCategory = document.createElement("td");
        tdCategory.textContent =
          exp.category === "Advance_Payment"
            ? "Advance"
            : exp.category === "Local_Transport"
            ? "Local Transport"
            : exp.category;
        const tdAmount = document.createElement("td");
        tdAmount.textContent = `₹ ${Number(exp.amount).toLocaleString(
          "en-IN"
        )}`;

        tr.appendChild(tdCategory);
        tr.appendChild(tdAmount);
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      cardTableDetails.appendChild(table);
      cardExpTable.appendChild(cardTableDetails);
    });

    const cardThirdDetails = document.createElement("div");
    cardThirdDetails.className = "cardInfo";

    cardThirdDetails.innerHTML = `<h6>Transport Expenses: ₹ ${guestDetails.totalTransportAmt.toLocaleString(
      "en-IN"
    )}</h6>`;

    const cardFourthDetails = document.createElement("div");
    cardFourthDetails.className = "cardInfo";

    cardFourthDetails.innerHTML = `<h6>Food Expenses: ₹ ${Number(
      guestDetails.totalFoodAmt
    ).toLocaleString("en-IN")}</h6>`;

    const cardFifthDetails = document.createElement("div");
    cardFifthDetails.className = "cardInfo";

    cardFifthDetails.innerHTML = `<h6>Common Expenses: ₹ ${Number(
      guestDetails.totalCommonAmt
    ).toLocaleString("en-IN")}</h6>`;

    const cardsixthDetails = document.createElement("div");
    cardsixthDetails.className = "cardInfo";

    cardsixthDetails.innerHTML = `<h6>Total Expenses: ₹ ${Number(
      guestDetails.totalExpenses
    ).toLocaleString("en-IN")}</h6>`;

    const cardBottomDetails = document.createElement("div");
    cardBottomDetails.className = "cardBottomDetails";

    const cardBottomFirstDetails = document.createElement("div");
    cardBottomFirstDetails.className = "cardBottomFirstDetails";

    if (guestDetails.toSend === 0) {
      cardBottomFirstDetails.innerHTML = `<h6 style="color: green;">Receive: ₹ ${Math.abs(
        Number(guestDetails.toReceive)
      ).toLocaleString(
        "en-IN"
      )} <i class="fa-solid fa-arrow-turn-down" style="color: green;  margin-right: 5px; font-size: 15px;"></i></h6>`;
    } else {
      cardBottomFirstDetails.innerHTML = `<h6 style="color: red;"> Send: ₹ ${Number(
        guestDetails.toSend
      ).toLocaleString(
        "en-IN"
      )} <i class="fa-solid fa-arrow-turn-up" style="color: red;  margin-right: 5px; font-size: 15px;"></i></h6>`;
    }

    cardBottomDetails.appendChild(cardBottomFirstDetails);

    cardDetails.appendChild(cardFirstDetails);
    cardDetails.appendChild(cardSecondDetails);
    cardDetails.appendChild(cardThirdDetails);
    cardDetails.appendChild(cardFourthDetails);
    cardDetails.appendChild(cardFifthDetails);
    cardDetails.appendChild(cardsixthDetails);
    cardDetails.appendChild(cardBottomDetails);
    cont1.appendChild(cardDetails);

    /*********************** */

    const cardTable = document.getElementById("card-table");
    const cardTableDetails = document.createElement("div");
    cardTableDetails.className = "cardTable";
    const table = document.createElement("table");
    table.className = "summary-table";

    const tbody = document.createElement("tbody");

    const rows = [
      {
        label: "Transport Per head",
        value: "₹ " + guestDetails.transportPerHead.toLocaleString("en-IN"),
      },
      {
        label: "Transport Total Cost",
        value: "₹ " + guestDetails.totalTransportAmt.toLocaleString("en-IN"),
      },
      {
        label: "Food Veg Cost",
        value: "₹ " + guestDetails.vegAmt.toLocaleString("en-IN"),
      },
      {
        label: "Food NonVeg Cost",
        value: "₹ " + guestDetails.nonVegAmt.toLocaleString("en-IN"),
      },
      {
        label: "Food Common",
        value: "₹ " + guestDetails.foodAmt.toLocaleString("en-IN"),
      },
      {
        label: "Food Total Cost",
        value: "₹ " + guestDetails.totalFoodAmt.toLocaleString("en-IN"),
      },
      {
        label: "Common Per Head",
        value: "₹ " + guestDetails.commonExp.toLocaleString("en-IN"),
      },
      {
        label: "Common Expense Total",
        value: "₹ " + guestDetails.totalCommonAmt.toLocaleString("en-IN"),
      },
    ];

    console.log(rows);

    rows.forEach(({ label, value }) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = label;

      const td = document.createElement("td");
      td.textContent = value;

      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    cardTableDetails.appendChild(table);
    cardTable.appendChild(cardTableDetails);
  } catch (err) {}
});

function closespentform() {
  document.getElementById("spent_details").style.display = "none";
}

function findexp(explist, guestId) {
  console.log(explist);
  console.log(guestId);
  return explist.filter((item) => item.guest_Id === guestId);
}

function findexpByGroup(explist, guestId) {
  console.log(explist);
  console.log(guestId);
  const filteredDate = explist.filter((item) => item.guest_Id === guestId);

  const categoryTotals = {};
  filteredDate.forEach((exp) => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += exp.amount;
  });

  return (output = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  })));
  // console.log(output);

  // console.log(filteredDate);
}
