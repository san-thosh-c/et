document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get("tripId");
  const tripName = urlParams.get("tripName");
  const theme = localStorage.getItem("selectedTheme");
  const selectedCategory = localStorage.getItem("selectedCategory");

  let category =
    selectedCategory === "Local Transport"
      ? "Local_Transport"
      : selectedCategory === "Advanced Payments"
      ? "Advance_Payment"
      : selectedCategory;
  console.log("theme = ", theme);
  console.log("tripId = ", tripId);
  console.log("tripName = ", tripName);
  console.log("selectedCategory = ", selectedCategory);
  console.log("category = ", category);
  document.body.className = "";
  document.body.classList.add(theme);
  console.log("theme apply = ", document.body.classList);

  document.getElementById("tripname").innerHTML = tripName;
  const backBtn = document.getElementById("categoryhome_back");
  document.getElementById("cat_title").innerHTML =
    selectedCategory + " Expenses";

  try {
    const expense_req = await fetch(`/api/getexpenses/${tripId}`);
    const expenses_res = await expense_req.json();

    setTimeout(() => {
      const element1 = document.getElementById("totalexpenses");
      element1.style.visibility = "visible";
      element1.innerHTML =
        "₹ " +
        expenses_res
          .reduce((sum, exp) => sum + exp.amount, 0)
          .toLocaleString("en-IN");
    }, 1000);
    let category_list = filterByCategory(category, expenses_res);
    console.log("category_list = ", category_list);

    setTimeout(() => {
      const element = document.getElementById("categoryexpenses");
      element.style.visibility = "visible";
      element.innerHTML =
        "₹ " +
        category_list
          .reduce((sum, exp) => sum + exp.amount, 0)
          .toLocaleString("en-IN");
    }, 1000);

    const cat_view_container = document.getElementById("categoryview_list");
    cat_view_container.innerHTML = "";
    category_list.forEach((op, index) => {
      console.log(op);
      const card = document.createElement("div");
      card.className = "exp-card";
      card.style.animationDelay = `${index * 400}ms`;
      console.log("1");
      const cardLeft = document.createElement("div");
      cardLeft.className = "categorybadge";
      if (op.category === "Accomodation") {
        cardLeft.classList.add("fa-solid", "fa-bed");
        cardLeft.style.color = "chocolate";
      }
      if (op.category === "Local_Transport") {
        cardLeft.classList.add("fa-solid", "fa-car-side");
        cardLeft.style.color = "red";
        op.category = "Local Transport";
      }
      if (op.category === "Transport") {
        cardLeft.classList.add("fa-solid", "fa-plane");
        cardLeft.style.color = "blue";
      }
      if (op.category === "Food") {
        cardLeft.classList.add("fa-solid", "fa-utensils");
        cardLeft.style.color = "brown";
      }
      if (op.category === "Fuel") {
        cardLeft.classList.add("fa-solid", "fa-gas-pump");
        cardLeft.style.color = "teal";
      }
      if (op.category === "Ticket") {
        cardLeft.classList.add("fa-solid", "fa-ticket");
        cardLeft.style.color = "darkorange";
      }
      if (op.category === "Snacks") {
        cardLeft.classList.add("fa-solid", "fa-cookie-bite");
        cardLeft.style.color = "brown";
      }
      if (op.category === "Advance_Payment") {
        cardLeft.classList.add("fa-solid", "fa-indian-rupee-sign");
        cardLeft.style.color = "green";
        op.category = "Advanced Payments";
      }
      if (op.category === "Others") {
        cardLeft.classList.add("fa-solid", "fa-box");
        cardLeft.style.color = "orangered";
      }
      const cardRight = document.createElement("div");
      cardRight.className = "exp-details";
      console.log("2");
      const cardRight_top = document.createElement("p");
      cardRight_top.className = "exp-category";
      cardRight_top.innerHTML = `${op.category}`;
      console.log("3");
      const cardRight_btm = document.createElement("p");
      cardRight_btm.className = "exp-name";
      cardRight_btm.innerHTML = `Paid By: <strong>${op.guestname}</strong>`;
      console.log("4");
      const d1 = document.createElement("p");
      d1.className = "exp-date";
      d1.innerHTML = op.date;

      const card_end = document.createElement("div");
      card_end.className = "exp-amount";
      card_end.innerHTML = "₹ " + op.amount.toLocaleString("en-IN");

      cardRight.appendChild(cardRight_top);
      cardRight.appendChild(cardRight_btm);
      cardRight.appendChild(d1);
      card.appendChild(cardLeft);
      card.appendChild(cardRight);
      card.appendChild(card_end);
      cat_view_container.appendChild(card);
      console.log(card);
    });
  } catch (err) {}

  backBtn.onclick = () => {
    const url = `../html/tripdetails.html?tripId=${encodeURIComponent(
      tripId
    )}&tripName=${encodeURIComponent(tripName)}`;
    window.location.href = url;
  };

  window.showAll = async function () {
    try {
      const expense_req = await fetch(`/api/getexpenses/${tripId}`);
      const expenses_res = await expense_req.json();
      document.getElementById("cat_title").innerHTML = "All Expenses";
      const categoryTotals = {};

      expenses_res.forEach((exp) => {
        if (!categoryTotals[exp.category]) {
          categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += exp.amount;
      });

      const output = Object.entries(categoryTotals).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      );
      console.log(output);

      setTimeout(() => {
        const element1 = document.getElementById("totalexpenses");
        element1.style.visibility = "visible";
        element1.innerHTML =
          "₹ " +
          expenses_res
            .reduce((sum, exp) => sum + exp.amount, 0)
            .toLocaleString("en-IN");
      }, 1000);
      setTimeout(() => {
        const element = document.getElementById("categoryexpenses");
        element.style.visibility = "visible";
        element.innerHTML =
          "₹ " +
          expenses_res
            .reduce((sum, exp) => sum + exp.amount, 0)
            .toLocaleString("en-IN");
      }, 1000);

      const cat_view_container = document.getElementById("categoryview_list");
      cat_view_container.innerHTML = "";
      output.forEach((op, index) => {
        const card = document.createElement("div");
        card.className = "cat-card";
        card.style.animationDelay = `${index * 100}ms`;

        const cardLeft = document.createElement("div");
        cardLeft.className = "categorybadge";
        if (op.category === "Accomodation") {
          cardLeft.classList.add("fa-solid", "fa-bed");
          cardLeft.style.color = "chocolate";
        }
        if (op.category === "Local_Transport") {
          cardLeft.classList.add("fa-solid", "fa-car-side");
          cardLeft.style.color = "red";
          op.category = "Local Transport";
        }
        if (op.category === "Transport") {
          cardLeft.classList.add("fa-solid", "fa-plane");
          cardLeft.style.color = "blue";
        }
        if (op.category === "Food") {
          cardLeft.classList.add("fa-solid", "fa-utensils");
          cardLeft.style.color = "brown";
        }
        if (op.category === "Fuel") {
          cardLeft.classList.add("fa-solid", "fa-gas-pump");
          cardLeft.style.color = "teal";
        }
        if (op.category === "Ticket") {
          cardLeft.classList.add("fa-solid", "fa-ticket");
          cardLeft.style.color = "darkorange";
        }
        if (op.category === "Snacks") {
          cardLeft.classList.add("fa-solid", "fa-cookie-bite");
          cardLeft.style.color = "brown";
        }
        if (op.category === "Advance_Payment") {
          cardLeft.classList.add("fa-solid", "fa-indian-rupee-sign");
          cardLeft.style.color = "green";
          op.category = "Advanced Payments";
        }
        if (op.category === "Others") {
          cardLeft.classList.add("fa-solid", "fa-box");
          cardLeft.style.color = "orangered";
        }

        const cardRight = document.createElement("div");
        cardRight.className = "categorydetails";

        const cardRight_top = document.createElement("p");
        cardRight_top.className = "cat-category";
        cardRight_top.innerHTML = `${op.category}`;

        const cardRight_btm = document.createElement("p");
        cardRight_btm.className = "cat-amt";
        cardRight_btm.innerHTML = `₹  <strong>${op.amount.toLocaleString(
          "en-IN"
        )}</strong>`;

        cardRight.appendChild(cardRight_top);
        cardRight.appendChild(cardRight_btm);
        card.appendChild(cardLeft);
        card.appendChild(cardRight);

        categoryview_list.appendChild(card);

        card.addEventListener("click", () => {
          console.log(tripId);
          console.log(op.category);
          localStorage.setItem("selectedTripId", tripId);
          localStorage.setItem("selectedTripName", tripName);
          localStorage.setItem("selectedCategory", op.category);
          const url = `../html/categoryview.html?tripId=${encodeURIComponent(
            tripId
          )}&tripName=${encodeURIComponent(tripName)}`;
          window.location.href = url;
        });
      });
    } catch (err) {}
  };

  function filterByCategory(category, exp) {
    return exp.filter((item) => item.category === category);
  }
});
