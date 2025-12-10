document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get("tripId");
  const tripName = urlParams.get("tripName");
  const theme = localStorage.getItem("selectedTheme");
  console.log("theme = ", theme);
  document.body.className = "";
  document.body.classList.add(theme);
  console.log("theme apply = ", document.body.classList);
  let trip_setting_back = false;
  let guest_id;
  let guestId, guestName, guestFlatNumber, expense_id, expense_list, guest_list;
  let totalExpenses = 0;
  let foodshare;
  let expenses_res;

  const name = document.getElementById("tripname");
  const trip_home_back = document.getElementById("triphome_back");
  const trip_setting_icon = document.getElementById("trip_settings_icon");
  const trip_main_details = document.getElementById("trip_main_details");
  const trip_settings_view = document.getElementById("trip_settings");
  const pp_popup = document.getElementById("pp_popupForm");
  const addBtn = document.getElementById("addparticipants");
  const gm_members = document.getElementById("gm_members");
  name.textContent = tripName;

  const exp_list = document.getElementById("expense_list");
  const cat_list = document.getElementById("category_list");

  // Add Expense Code
  const addExpenseBtn = document.getElementById("add_expense");
  const addExp = document.getElementById("addexpense");
  const addExp_back_btn = document.getElementById("add_exp_back");
  const selectguest = document.querySelector("select[name='guestlist']");
  const selectedguest = document.getElementById("exp_guest");
  const exp_category = document.getElementById("category");
  const edit_exp_category = document.getElementById("edit_category");
  const edit_edp_ck_btn = document.getElementById("edit_exp_back");
  const guestSelect = document.getElementById("edit_exp_guest");

  function getRandomColor() {
    const colors = [
      "#f199a2ee",
      "#f8bbd0d7",
      "#e1bee7b2",
      "#d1c4e9a9",
      "#c5cae9b9",
      "#bbdefbcb",
      "#b2ebf2d3",
      "#c8e6c9b4",
      "#dcedc8b2",
      "#fff9c4b6",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  async function fetchExpenses() {
    try {
      cat_list.style.display = "none";
      const expense_req = await fetch(`/api/getexpenses/${tripId}`);
      expenses_res = await expense_req.json();

      console.log("Expenses = ", expenses_res);

      const exp_container = exp_list;
      exp_container.innerHTML = "";
      const response = await fetch(`/api/guest/${tripId}`);
      const guests = await response.json();
      guest_list = guests;
      expense_list = expenses_res;
      document.getElementById("exp_count").innerHTML =
        "Number of Expenses: " + expenses_res.length;
      const container = gm_members;
      container.innerHTML = "";
      const totalPersons = guests.reduce(
        (sum, guest) => sum + guest.adults + guest.kids,
        0
      );
      document.getElementById("numberofpp").innerHTML =
        totalPersons + " Participants";

      if (expenses_res.length === 0) {
        document.getElementById("exp_count").style.display = "none";
        const card = document.createElement("div");
        card.className = "noexp-card";
        const card_con = document.createElement("i");
        card_con.className = "fa-solid fa-file";
        const card_text = document.createElement("div");
        card_text.className = "noexp_text";
        card_text.innerHTML =
          "No Expenses Yet. Add an expense by tapping Add Expense button to start tracking";
        card.appendChild(card_con);
        card.appendChild(card_text);
        exp_container.appendChild(card);
      }
      if (expenses_res.length > 0) {
        expenses_res.forEach((exp, index) => {
          // console.log("index=", index);
          totalExpenses = expenses_res.reduce((sum, g1) => sum + g1.amount, 0);
          document.getElementById("fullamt").innerHTML =
            "₹ " + totalExpenses.toLocaleString("en-IN");
          const card = document.createElement("div");
          card.className = "exp-card";
          card.style.animationDelay = `${index * 100}ms`;
          card.dataset.exp_id = exp._id;

          const cardLeft = document.createElement("div");
          cardLeft.className = "categorybadge";
          if (exp.category === "Accomodation") {
            cardLeft.classList.add("fa-solid", "fa-bed", "first-letter-badge");
            cardLeft.style.color = "chocolate";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Local_Transport") {
            cardLeft.classList.add(
              "fa-solid",
              "fa-car-side",
              "first-letter-badge"
            );
            cardLeft.style.color = "red";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Transport") {
            cardLeft.classList.add(
              "fa-solid",
              "fa-plane",
              "first-letter-badge"
            );
            cardLeft.style.color = "blue";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Food") {
            cardLeft.classList.add(
              "fa-solid",
              "fa-utensils",
              "first-letter-badge"
            );
            cardLeft.style.color = "brown";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Fuel") {
            cardLeft.classList.add(
              "fa-solid",
              "fa-gas-pump",
              "first-letter-badge"
            );
            cardLeft.style.color = "teal";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Ticket") {
            cardLeft.classList.add(
              "fa-solid",
              "fa-ticket",
              "first-letter-badge"
            );
            cardLeft.style.color = "darkorange";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Snacks") {
            cardLeft.classList.add(
              "fa-solid",
              "fa-cookie-bite",
              "first-letter-badge"
            );
            cardLeft.style.color = "brown";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Advance_Payment") {
            cardLeft.classList.add(
              "fa-solid",
              "fa-indian-rupee-sign",
              "first-letter-badge"
            );
            cardLeft.style.color = "green";
            cardLeft.style.border = "none";
          }
          if (exp.category === "Others") {
            cardLeft.classList.add("fa-solid", "fa-box", "first-letter-badge");
            cardLeft.style.color = "orangered";
            cardLeft.style.border = "none";
          }

          const cardRight = document.createElement("div");
          cardRight.className = "exp-details";

          const cardRight_top = document.createElement("p");
          cardRight_top.className = "exp-category";
          if (exp.category === "Advance_Payment") {
            cardRight_top.innerHTML = "Advance";
          } else if (exp.category === "Local_Transport") {
            cardRight_top.innerHTML = "Local Transport";
          } else {
            cardRight_top.innerHTML = `${exp.category}`;
          }

          const cardRight_btm = document.createElement("p");
          cardRight_btm.className = "exp-name";
          cardRight_btm.innerHTML = `Paid By: <strong>${exp.guestname}</strong>`;

          const d1 = document.createElement("p");
          d1.className = "exp-date";
          d1.innerHTML = exp.date;

          const card_end = document.createElement("div");
          card_end.className = "exp-amount";
          card_end.innerHTML = "₹ " + exp.amount.toLocaleString("en-IN");

          const card_end_1 = document.createElement("div");
          card_end_1.className = "exp-change";
          const cardEnd_icon1 = document.createElement("i");
          cardEnd_icon1.className = "fa-solid fa-pen";
          const cardEnd_icon2 = document.createElement("i");
          cardEnd_icon2.className = "fa-solid fa-trash";

          card_end_1.appendChild(cardEnd_icon1);
          card_end_1.appendChild(cardEnd_icon2);

          cardEnd_icon2.addEventListener("click", () => {
            expense_id = card.dataset.exp_id;
            delete_exp(expense_id);
          });

          cardEnd_icon1.addEventListener("click", () => {
            expense_id = card.dataset.exp_id;
            console.log("selected exp = ", expense_id);
            guestSelect.innerHTML = "";
            guests.forEach((guest) => {
              const option = document.createElement("option");
              option.value = guest.guestname;
              option.textContent = guest.guestname;
              option.setAttribute("data-flat", guest.flatNumber);
              option.setAttribute("data-tripid", guest.trip_id);
              option.setAttribute("data-id", guest._id);
              guestSelect.appendChild(option);
            });

            guestSelect.value = exp.guestname;
            const firstLet = guestSelect.value.charAt(0);
            console.log(firstLet);
            const t1 = document.getElementById("edit_icon_display_1");
            t1.className = "first-letter-badge";
            t1.innerHTML = firstLet;
            document.getElementById("editexpense").style.display = "block";
            trip_setting_back = true;
            document.getElementById("subheader").style.display = "none";
            trip_main_details.style.display = "none";
            document.querySelector(".right-buttons").style.display = "none";
            document.getElementById("edit_category").value = exp.category;
            document.getElementById("edit_exp_amt").value = exp.amount;
            document.getElementById("edit_exp_date").value = exp.date;
            console.log("exp====", exp);
            const idisplayContainer =
              document.getElementById("edit_icon_display");
            idisplayContainer.innerHTML = "";
            idisplayContainer.style.border = "none";
            const icon = document.createElement("i");
            if (exp.category === "Local_Transport") {
              icon.classList.add("fa-solid", "fa-car-side");
              icon.style.color = "red";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            if (exp.category === "Transport") {
              icon.classList.add("fa-solid", "fa-plane");
              icon.style.color = "blue";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            if (exp.category === "Food") {
              console.log("***");
              icon.classList.add("fa-solid", "fa-utensils");
              icon.style.color = "brown";
              document.getElementById("editexp_food").style.display = "flex";

              if (exp.split_food === "Yes") {
                console.log("yes");
                document.querySelector(
                  'input[name="editfoodoption"][value="Yes"]'
                ).checked = true;
                document.getElementById("editfoodshare").style.display = "flex";
              }

              if (exp.split_food === "No") {
                console.log("no");
                document.querySelector(
                  'input[name="editfoodoption"][value="No"]'
                ).checked = true;
                document.getElementById("editfoodshare").style.display = "none";
                document.getElementById("editexp_amt").style.display = "flex";
              }

              if (exp.split_share === "60_40" && exp.split_food == "Yes") {
                console.log("60_40");
                document.querySelector(
                  'input[name="editfoodshare"][value="60_40"]'
                ).checked = true;
                document.getElementById("editexp_amt").style.display = "flex";
                document.getElementById("edit_exp_amt").value = exp.amount;
                document.getElementById("editfoodamt").style.display = "none";
              }
              if (exp.split_share === "NA" && exp.split_food == "Yes") {
                console.log("na");
                document.querySelector(
                  'input[name="editfoodshare"][value="Yes"]'
                ).checked = true;
                document.getElementById("editfoodamt").style.display = "flex";
                document.getElementById("editexp_veg").value = exp.veg;
                document.getElementById("editexp_nveg").value = exp.nveg;
                document.getElementById("editexp_amt").style.display = "none";
              }
            }
            if (exp.category === "Fuel") {
              icon.classList.add("fa-solid", "fa-gas-pump");
              icon.style.color = "teal";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            if (exp.category === "Accomodation") {
              icon.classList.add("fa-solid", "fa-bed");
              icon.style.color = "chocolate";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            if (exp.category === "Ticket") {
              icon.classList.add("fa-solid", "fa-ticket");
              icon.style.color = "darkorange";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            if (exp.category === "Snacks") {
              icon.classList.add("fa-solid", "fa-cookie-bite");
              icon.style.color = "brown";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            if (exp.category === "Advance_Payment") {
              icon.classList.add("fa-solid", "fa-indian-rupee-sign");
              icon.style.color = "green";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            if (exp.category === "Others") {
              icon.classList.add("fa-solid", "fa-box");
              icon.style.color = "orangered";
              document.getElementById("editexp_food").style.display = "none";
              document.getElementById("editexp_amt").style.display = "flex";
            }
            icon.classList.add("first-letter-badge");
            idisplayContainer.appendChild(icon);
          });
          cardRight.appendChild(cardRight_top);
          cardRight.appendChild(cardRight_btm);
          cardRight.appendChild(d1);
          card.appendChild(cardLeft);
          card.appendChild(cardRight);
          card.appendChild(card_end);
          card.appendChild(card_end_1);

          exp_container.appendChild(card);
        });
      }
      guests.forEach((guest) => {
        const firstLetter = guest.guestname.charAt(0);
        const total_pp = Number(guest.adults) + Number(guest.kids);
        const card = document.createElement("div");
        card.className = "guest-card";
        // card.style.backgroundColor = getRandomColor();
        card.dataset.guest_id = guest._id;
        const cardLeft = document.createElement("div");
        cardLeft.className = "first-letter-badge";
        cardLeft.innerHTML = firstLetter;

        const cardRight = document.createElement("div");
        cardRight.className = "guest-details";

        const cardRight_top = document.createElement("p");
        cardRight_top.className = "guest-name";
        if (!guest.financier) {
          cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
        } else {
          const cardRight_top_admin = document.createElement("i");
          cardRight_top_admin.className = "fa-solid fa-user-tie adminicon";
          cardRight_top_admin.setAttribute("title", "Financier");

          cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
          cardRight_top.appendChild(cardRight_top_admin);
        }

        const cardRight_btm = document.createElement("p");
        cardRight_btm.className = "guest-flat";
        cardRight_btm.innerHTML = total_pp + " participants";

        const card_end = document.createElement("div");
        card_end.className = "guest-change";
        const cardEnd_icon1 = document.createElement("i");
        cardEnd_icon1.className = "fa-solid fa-pen";
        const cardEnd_icon2 = document.createElement("i");
        cardEnd_icon2.className = "fa-solid fa-trash";

        cardEnd_icon1.addEventListener("click", () => {
          guest_id = card.dataset.guest_id;

          console.log("selected name = ", guest.financier);
          document.getElementById("pp_edit_popupForm").style.display = "flex";
          document.getElementById("pp_edit_popupForm").style.zIndex = "1";
          document.getElementById("edit_guestname").value = guest.guestname;
          document.getElementById("edit_flatNumber").value = guest.flatNumber;
          document.getElementById("edit_noOfAdults").value = guest.adults;
          document.getElementById("edit_noOfKids").value = guest.kids;
          document.getElementById("edit_veg").value = guest.veg;
          document.getElementById("edit_nv").value = guest.nonVeg;
          document.getElementById("edit_tripname_PP").value = tripName;
          document.getElementById("edit_admin_PP").checked = guest.financier;
        });

        cardEnd_icon2.addEventListener("click", () => {
          guest_id = card.dataset.guest_id;
          console.log("selected id = ", guest_id);
          document.getElementById("popup_delete_guest").style.display = "flex";
          document.getElementById("popup_delete_guest").style.zIndex = "1";
        });

        card_end.appendChild(cardEnd_icon1);
        card_end.appendChild(cardEnd_icon2);

        cardRight.appendChild(cardRight_top);
        cardRight.appendChild(cardRight_btm);
        card.appendChild(cardLeft);
        card.appendChild(cardRight);
        card.appendChild(card_end);
        container.appendChild(card);
      });
    } catch (err) {
      console.error("Error fetching Guest records:", err);
      res.status(500).json({ error: "Failed to fetch Guest records" });
    }
  }
  expenses_res = await fetchExpenses();

  //Add Exp back button
  addExp_back_btn.onclick = () => {
    document.getElementById("subheader").style.display = "flex";
    trip_main_details.style.display = "flex";
    addExp.style.display = "none";
    document.getElementById("subheader_add_expense").style.display = "none";
    trip_setting_back = false;
  };

  //edit Exp back button
  edit_edp_ck_btn.onclick = () => {
    trip_main_details.style.display = "flex";
    document.getElementById("editexpense").style.display = "none";
    document.getElementById("subheader").style.display = "flex";
    document.querySelector(".right-buttons").style.display = "flex";
  };

  //trip home view back button
  trip_home_back.onclick = () => {
    console.log(trip_setting_back);
    if (trip_setting_back) {
      console.log("1");
      trip_main_details.style.display = "flex";
      trip_settings_view.style.display = "none";
      name.textContent = tripName;
      document.querySelector(".right-buttons").style.display = "flex";
      trip_setting_back = false;
    } else {
      window.location.href = "../html/index.html";
    }
  };

  //trip setting button click
  trip_setting_icon.onclick = () => {
    trip_setting_back = true;
    trip_main_details.style.display = "none";
    trip_settings_view.style.display = "block";
    name.textContent = "Trip Settings";
    document.querySelector(".right-buttons").style.display = "none";
    document.getElementById("trip_setting_tripname").textContent = tripName;
  };

  //Add guest button click
  addBtn.onclick = () => {
    pp_popup.style.display = "flex";
    pp_popup.style.zIndex = "1";
    document.getElementById("tripname_PP").value = tripName;
    document.getElementById("guestname").value = "";
    document.getElementById("flatNumber").value = "";
    document.getElementById("noOfAdults").value = "0";
    document.getElementById("noOfKids").value = "0";
    document.getElementById("veg").value = "0";
    document.getElementById("nv").value = "0";
    document.getElementById("admin_PP").checked = false;
  };

  //add exp button click
  addExpenseBtn.onclick = async () => {
    document.getElementById("subheader").style.display = "none";
    document.getElementById("editexpense").style.display = "none";
    trip_main_details.style.display = "none";
    addExp.style.display = "block";
    document.getElementById("subheader_add_expense").style.display = "flex";
    document.getElementById(
      "addexp_tripname_p"
    ).textContent = `You are adding Expense for ${tripName}`;
    document.getElementById("category").value = "";
    document.getElementById("exp_amt").value = "";
    document.getElementById("exp_date").value = "";
    document.getElementById("exp_guest").value = "";
    document.getElementById("addexp_food").style.display = "none";
    const idisplayContainer = document.getElementById("icon_display");
    idisplayContainer.innerHTML = "";
    // idisplayContainer.style.border = "none";

    document
      .querySelectorAll('input[name="foodoption"], input[name="foodshare"]')
      .forEach((radio) => {
        radio.checked = false;
      });

    try {
      const response = await fetch(`/api/guest/${tripId}`);
      const guests = await response.json();
      selectguest.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "Select the Guest";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectguest.appendChild(defaultOption);
      guests.forEach((guest) => {
        const option = document.createElement("option");
        option.value = guest.guestname;
        option.textContent = guest.guestname;
        option.setAttribute("data-flat", guest.flatNumber);
        option.setAttribute("data-tripid", guest.trip_id);
        option.setAttribute("data-id", guest._id);
        selectguest.appendChild(option);
      });
    } catch (err) {
      showNotification("Failed to load guest list", "Y");
    }
  };

  //save guest button
  window.submitForm = async function () {
    const guestname = document.getElementById("guestname").value;
    const flatNumber = document.getElementById("flatNumber").value;
    const adults = document.getElementById("noOfAdults").value;
    const kids = document.getElementById("noOfKids").value;
    const noofVeg = document.getElementById("veg").value;
    const noofNonVeg = document.getElementById("nv").value;
    const trip_id = tripId;
    const financier = document.getElementById("admin_PP").checked;

    try {
      const create_response = await fetch("/addguest", {
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
          financier,
        }),
      });

      const create_result = await create_response.json();

      if (create_result.success) {
        showNotification("Guest added successfully!", "Y");
        const response = await fetch(`/api/guest/${tripId}`);
        const guests = await response.json();
        console.log("************=>", guests);
        const container = gm_members;
        container.innerHTML = "";
        const totalPersons = guests.reduce(
          (sum, guest) => sum + guest.adults + guest.kids,
          0
        );
        document.getElementById("numberofpp").innerHTML =
          totalPersons + " Participants";

        guests.forEach((guest, index) => {
          const firstLetter = guest.guestname.charAt(0);
          const total_pp = Number(guest.adults) + Number(guest.kids);
          const card = document.createElement("div");
          card.className = "guest-card";
          card.style.animationDelay = `${index * 100}ms`;
          // card.style.backgroundColor = getRandomColor();

          const cardLeft = document.createElement("div");
          cardLeft.className = "first-letter-badge";
          cardLeft.innerHTML = firstLetter;

          const cardRight = document.createElement("div");
          cardRight.className = "guest-details";

          const cardRight_top = document.createElement("p");
          cardRight_top.className = "guest-name";
          if (!guest.financier) {
            cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
          } else {
            const cardRight_top_admin = document.createElement("i");
            cardRight_top_admin.className = "fa-solid fa-user-tie adminicon";
            cardRight_top_admin.setAttribute("title", "Financier");

            cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
            cardRight_top.appendChild(cardRight_top_admin);
          }

          const cardRight_btm = document.createElement("p");
          cardRight_btm.className = "guest-flat";
          cardRight_btm.innerHTML = total_pp + " participants";

          const card_end = document.createElement("div");
          card_end.className = "guest-change";
          const cardEnd_icon1 = document.createElement("i");
          cardEnd_icon1.className = "fa-solid fa-pen";
          const cardEnd_icon2 = document.createElement("i");
          cardEnd_icon2.className = "fa-solid fa-trash";

          cardEnd_icon1.addEventListener("click", () => {
            guest_id = card.dataset.guest_id;
            console.log("selected id = ", guest_id);
            document.getElementById("edit_guestname").value = guest.guestname;
            document.getElementById("edit_flatNumber").value = guest.flatNumber;
            document.getElementById("edit_noOfAdults").value = guest.adults;
            document.getElementById("edit_noOfKids").value = guest.kids;
            document.getElementById("edit_veg").value = guest.veg;
            document.getElementById("edit_nv").value = guest.nonVeg;
            document.getElementById("edit_tripname_PP").value = tripName;
            document.getElementById("edit_admin_PP").checked = guest.financier;
            document.getElementById("pp_edit_popupForm").style.display = "flex";
            document.getElementById("pp_edit_popupForm").style.zIndex = "1";
          });

          cardEnd_icon2.addEventListener("click", () => {
            guest_id = card.dataset.guest_id;
            console.log("selected id = ", guest_id);
            document.getElementById("popup_delete_guest").style.display =
              "flex";
            document.getElementById("popup_delete_guest").style.zIndex = "1";
          });

          card_end.appendChild(cardEnd_icon1);
          card_end.appendChild(cardEnd_icon2);
          cardRight.appendChild(cardRight_top);
          cardRight.appendChild(cardRight_btm);
          card.appendChild(cardLeft);
          card.appendChild(cardRight);
          card.appendChild(card_end);
          container.appendChild(card);
        });
      } else {
        showNotification(create_result.message, "N");
      }
    } catch (err) {
      console.error("Error:", err);
    }
    closeForm_pp();
  };

  //save edited guest button
  window.submitEditForm = async function () {
    const guestname = document.getElementById("edit_guestname").value;
    const flatNumber = document.getElementById("edit_flatNumber").value;
    const adults = document.getElementById("edit_noOfAdults").value;
    const kids = document.getElementById("edit_noOfKids").value;
    const noofVeg = document.getElementById("edit_veg").value;
    const noofNonVeg = document.getElementById("edit_nv").value;
    const trip_id = tripId;
    const financier = document.getElementById("edit_admin_PP").checked;
    console.log({
      guestname,
      flatNumber,
      adults,
      kids,
      noofVeg,
      noofNonVeg,
      trip_id,
      financier,
    });
    try {
      const guestupdateRes = await fetch(`/api/updateguests/${guest_id}`, {
        method: "PATCH",
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
          financier,
        }),
      });
      if (!guestupdateRes.ok) {
        closeEditForm_pp();
        showNotification("Failed to update guests!", "N");
      } else {
        closeEditForm_pp();
        showNotification("Guest details updated successfully!", "Y");
        const response = await fetch(`/api/guest/${tripId}`);
        const guests = await response.json();
        console.log("************=>", guests);
        const container = gm_members;
        container.innerHTML = "";
        const totalPersons = guests.reduce(
          (sum, guest) => sum + guest.adults + guest.kids,
          0
        );
        document.getElementById("numberofpp").innerHTML =
          totalPersons + " Participants";

        const totaladults = guests.reduce((sum, g1) => sum + g1.adults, 0);
        const totalkids = guests.reduce((sum, g2) => sum + g2.kids, 0);
        const totalveg = guests.reduce((sum, g3) => sum + g3.veg, 0);
        const totalnv = guests.reduce((sum, g4) => sum + g4.nonVeg, 0);
        // document.getElementById(
        //   "trip_adult"
        // ).innerHTML = `# of Adults: ${totaladults}`;
        // document.getElementById("trip_veg").innerHTML = `# of Veg: ${totalveg}`;
        // document.getElementById(
        //   "trip_kids"
        // ).innerHTML = `# of Kids: ${totalkids}`;
        // document.getElementById(
        //   "trip_nv"
        // ).innerHTML = `# of Non-Veg: ${totalnv}`;

        guests.forEach((guest) => {
          console.log(guest);
          const firstLetter = guest.guestname.charAt(0);
          const total_pp = Number(guest.adults) + Number(guest.kids);
          const card = document.createElement("div");
          card.className = "guest-card";
          // card.style.backgroundColor = getRandomColor();
          card.dataset.guest_id = guest._id;
          const cardLeft = document.createElement("div");
          cardLeft.className = "first-letter-badge";
          cardLeft.innerHTML = firstLetter;

          const cardRight = document.createElement("div");
          cardRight.className = "guest-details";

          const cardRight_top = document.createElement("p");
          cardRight_top.className = "guest-name";
          if (!guest.financier) {
            cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
          } else {
            const cardRight_top_admin = document.createElement("i");
            cardRight_top_admin.className = "fa-solid fa-user-tie adminicon";
            cardRight_top_admin.setAttribute("title", "Financier");

            cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
            cardRight_top.appendChild(cardRight_top_admin);
          }

          const cardRight_btm = document.createElement("p");
          cardRight_btm.className = "guest-flat";
          cardRight_btm.innerHTML = total_pp + " participants";

          const card_end = document.createElement("div");
          card_end.className = "guest-change";
          const cardEnd_icon1 = document.createElement("i");
          cardEnd_icon1.className = "fa-solid fa-pen";
          const cardEnd_icon2 = document.createElement("i");
          cardEnd_icon2.className = "fa-solid fa-trash";

          cardEnd_icon1.addEventListener("click", () => {
            guest_id = card.dataset.guest_id;
            console.log("selected id = ", guest.financier);
            document.getElementById("pp_edit_popupForm").style.display = "flex";
            document.getElementById("pp_edit_popupForm").style.zIndex = "1";
            document.getElementById("edit_guestname").value = guest.guestname;
            document.getElementById("edit_flatNumber").value = guest.flatNumber;
            document.getElementById("edit_noOfAdults").value = guest.adults;
            document.getElementById("edit_noOfKids").value = guest.kids;
            document.getElementById("edit_veg").value = guest.veg;
            document.getElementById("edit_nv").value = guest.nonVeg;
            document.getElementById("edit_tripname_PP").value = tripName;
            document.getElementById("edit_admin_PP").checked = guest.financier;
          });

          cardEnd_icon2.addEventListener("click", () => {
            guest_id = card.dataset.guest_id;
            console.log("selected id = ", guest_id);
            document.getElementById("popup_delete_guest").style.display =
              "flex";
            document.getElementById("popup_delete_guest").style.zIndex = "1";
          });

          card_end.appendChild(cardEnd_icon1);
          card_end.appendChild(cardEnd_icon2);
          cardRight.appendChild(cardRight_top);
          cardRight.appendChild(cardRight_btm);
          card.appendChild(cardLeft);
          card.appendChild(cardRight);
          card.appendChild(card_end);
          container.appendChild(card);
        });
      }
    } catch (err) {
      console.error("Error:", err);
      showNotification("Something went wrong during deletion", "N");
    }
  };

  //Delete Exp record
  window.confirmExpDelete = async function () {
    try {
      const expResponse = await fetch(`/api/deleteExp/${expense_id}`, {
        method: "DELETE",
      });
      console.log(expResponse);
      if (expResponse.status === 200) {
        hideExpdeletePopup();
        showNotification("Expense deleted successfully!", "Y");
        const expense_req = await fetch(`/api/getexpenses/${tripId}`);
        expenses_res = await fetchExpenses();
      }
    } catch (err) {
      showNotification("Something went wrong during expense deletion");
    }
  };

  window.confirmguestDelete = async function () {
    console.log("guest id=", guest_id);
    try {
      const guestResponse = await fetch(`/api/guests/${guest_id}`, {
        method: "DELETE",
      });

      if (!guestResponse.ok) {
        hidedeletePopup();
        showNotification("Failed to delete guests!", "N");
      } else {
        hidedeletePopup();
        showNotification("Guest deleted successfully!", "Y");
        const response = await fetch(`/api/guest/${tripId}`);
        const guests = await response.json();
        console.log("************=>", guests);
        const container = gm_members;
        container.innerHTML = "";
        const totalPersons = guests.reduce(
          (sum, guest) => sum + guest.adults + guest.kids,
          0
        );
        document.getElementById("numberofpp").innerHTML =
          totalPersons + " Participants";

        const totaladults = guests.reduce((sum, g1) => sum + g1.adults, 0);
        const totalkids = guests.reduce((sum, g2) => sum + g2.kids, 0);
        const totalveg = guests.reduce((sum, g3) => sum + g3.veg, 0);
        const totalnv = guests.reduce((sum, g4) => sum + g4.nonVeg, 0);
        // document.getElementById(
        //   "trip_adult"
        // ).innerHTML = `# of Adults: ${totaladults}`;
        // document.getElementById("trip_veg").innerHTML = `# of Veg: ${totalveg}`;
        // document.getElementById(
        //   "trip_kids"
        // ).innerHTML = `# of Kids: ${totalkids}`;
        // document.getElementById(
        //   "trip_nv"
        // ).innerHTML = `# of Non-Veg: ${totalnv}`;

        guests.forEach((guest) => {
          const firstLetter = guest.guestname.charAt(0);
          const total_pp = Number(guest.adults) + Number(guest.kids);
          const card = document.createElement("div");
          card.className = "guest-card";
          // card.style.backgroundColor = getRandomColor();

          const cardLeft = document.createElement("div");
          cardLeft.className = "first-letter-badge";
          cardLeft.innerHTML = firstLetter;

          const cardRight = document.createElement("div");
          cardRight.className = "guest-details";

          const cardRight_top = document.createElement("p");
          cardRight_top.className = "guest-name";
          if (!guest.financier) {
            cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
          } else {
            const cardRight_top_admin = document.createElement("i");
            cardRight_top_admin.className = "fa-solid fa-user-tie adminicon";
            cardRight_top_admin.setAttribute("title", "Financier");
            cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;
            cardRight_top.appendChild(cardRight_top_admin);
          }

          const cardRight_btm = document.createElement("p");
          cardRight_btm.className = "guest-flat";
          cardRight_btm.innerHTML = total_pp + " participants";

          const card_end = document.createElement("div");
          card_end.className = "guest-change";
          const cardEnd_icon1 = document.createElement("i");
          cardEnd_icon1.className = "fa-solid fa-pen";
          const cardEnd_icon2 = document.createElement("i");
          cardEnd_icon2.className = "fa-solid fa-trash";

          cardEnd_icon1.addEventListener("click", () => {
            guest_id = card.dataset.guest_id;
            console.log("selected id = ", guest.financier);
            document.getElementById("pp_edit_popupForm").style.display = "flex";
            document.getElementById("pp_edit_popupForm").style.zIndex = "1";
            document.getElementById("edit_guestname").value = guest.guestname;
            document.getElementById("edit_flatNumber").value = guest.flatNumber;
            document.getElementById("edit_noOfAdults").value = guest.adults;
            document.getElementById("edit_noOfKids").value = guest.kids;
            document.getElementById("edit_veg").value = guest.veg;
            document.getElementById("edit_nv").value = guest.nonVeg;
            document.getElementById("edit_tripname_PP").value = tripName;
            document.getElementById("edit_admin_PP").checked = guest.financier;
          });

          cardEnd_icon2.addEventListener("click", () => {
            guest_id = card.dataset.guest_id;
            console.log("selected id = ", guest_id);
            document.getElementById("popup_delete_guest").style.display =
              "flex";
            document.getElementById("popup_delete_guest").style.zIndex = "1";
          });

          card_end.appendChild(cardEnd_icon1);
          card_end.appendChild(cardEnd_icon2);
          cardRight.appendChild(cardRight_top);
          cardRight.appendChild(cardRight_btm);
          card.appendChild(cardLeft);
          card.appendChild(cardRight);
          card.appendChild(card_end);
          container.appendChild(card);
        });
      }
    } catch (err) {
      showNotification("Something went wrong during deletion");
    }
  };

  window.confirmDelete = async function () {
    console.log("Deleting guests and trip for tripId:", tripId);

    try {
      const guestResponse = await fetch(`/api/guest/${tripId}`, {
        method: "DELETE",
      });

      if (!guestResponse.ok) {
        throw new Error("Failed to delete guests");
      }

      const guestResult = await guestResponse.json();
      console.log("Guests deleted:", guestResult);

      const tripResponse = await fetch(`/api/trip/${tripId}`, {
        method: "DELETE",
      });

      if (!tripResponse.ok) {
        throw new Error("Failed to delete trip");
      }
      const tripResult = await tripResponse.json();
      console.log("Trip deleted:", tripResult);
      hidePopup();
      const url = `../html/index.html`;
      window.location.href = url;
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong during deletion");
    }
  };

  //Guest selection in Edit Expense
  guestSelect.addEventListener("change", () => {
    const selectedOption = guestSelect.options[guestSelect.selectedIndex];
    const selectedGuestName = selectedOption.value;
    const selectedGuestId = selectedOption.getAttribute("data-id");
    const firstLetter = selectedGuestName.charAt(0);
    guestId = selectedGuestId;
    guestName = selectedGuestName;
    guestFlatNumber = selectedOption.getAttribute("data-flat");
    console.log("guestId=", guestId);
    document.getElementById("edit_icon_display_1").className =
      "first-letter-badge";
    document.getElementById("edit_icon_display_1").innerHTML = firstLetter;
  });

  //Guest selection in Add Expense
  selectedguest.addEventListener("change", () => {
    const selectedOption = selectedguest.options[selectedguest.selectedIndex];
    const selectedGuestName = selectedOption.value;
    const selectedGuestId = selectedOption.getAttribute("data-id");
    const firstLetter = selectedGuestName.charAt(0);
    guestId = selectedGuestId;
    guestName = selectedGuestName;
    guestFlatNumber = selectedOption.getAttribute("data-flat");
    console.log("guestId=", guestId);
    document.getElementById("icon_display_1").className = "first-letter-badge";
    document.getElementById("icon_display_1").innerHTML = firstLetter;
  });

  //category change in Add expense
  exp_category.addEventListener("change", () => {
    const categoryIcons = {
      Transport: "fa-plane",
      Food: "fa-utensils",
      Fuel: "fa-gas-pump",
      Accomodation: "fa-bed",
      Ticket: "fa-ticket",
      Snacks: "fa-cookie-bite",
      Advance_Payment: "fa-indian-rupee-sign",
      Others: "fa-box",
    };

    const selectedOption = exp_category.options[exp_category.selectedIndex];
    const iconClass = categoryIcons[selectedOption.value] || "fa-pen";
    const idisplayContainer = document.getElementById("icon_display");
    idisplayContainer.innerHTML = "";
    idisplayContainer.style.border = "none";
    const icon = document.createElement("i");
    if (selectedOption.value === "Local_Transport") {
      icon.classList.add("fa-solid", "fa-car-side");
      icon.style.color = "red";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    } else {
      icon.classList.add("fa-solid", iconClass);
    }

    if (selectedOption.value === "Transport") {
      icon.style.color = "blue";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    }
    if (selectedOption.value === "Food") {
      icon.style.color = "brown";
      document.getElementById("addexp_amt").style.display = "none";
      document.getElementById("addexp_food").style.display = "flex";
      document.getElementById("foodshare").style.display = "none";

      document
        .getElementById("foodoption")
        .addEventListener("click", function () {
          const selected = document.querySelector(
            'input[name="foodoption"]:checked'
          );
          console.log("selected =", selected.value);
          if (selected.value === "Yes") {
            document.getElementById("addexp_food").style.display = "flex";
            document.getElementById("foodshare").style.display = "flex";
            document.getElementById("addexp_amt").style.display = "none";
            document.getElementById("foodamt").style.display = "none";
            const t1 = document
              .getElementById("foodshare_option")
              .addEventListener("click", function () {
                const selectedfoodshare = document.querySelector(
                  'input[name="foodshare"]:checked'
                );
                console.log("inside1", selectedfoodshare);
                if (selectedfoodshare.value === "60_40") {
                  foodshare = "6040";
                  document.getElementById("addexp_food").style.display = "flex";
                  document.getElementById("addexp_amt").style.display = "flex";
                  document.getElementById("foodshare").style.display = "flex";
                  document.getElementById("foodoption").style.display = "flex";
                  document.getElementById("foodamt").style.display = "none";
                }
                if (selectedfoodshare.value === "Yes") {
                  console.log("inside");
                  document.getElementById("foodamt").style.display = "flex";
                  document.getElementById("addexp_amt").style.display = "none";
                }
              });
          } else {
            document.getElementById("addexp_food").style.display = "flex";
            document.getElementById("addexp_amt").style.display = "flex";
            document.getElementById("foodshare").style.display = "none";
            document.getElementById("foodoption").style.display = "flex";
          }
        });
    }
    if (selectedOption.value === "Fuel") {
      icon.style.color = "teal";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    }
    if (selectedOption.value === "Accomodation") {
      icon.style.color = "chocolate";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    }
    if (selectedOption.value === "Ticket") {
      icon.style.color = "darkorange";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    }
    if (selectedOption.value === "Snacks") {
      icon.style.color = "brown";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    }
    if (selectedOption.value === "Advance_Payment") {
      icon.style.color = "green";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    }
    if (selectedOption.value === "Others") {
      icon.style.color = "orangered";
      document.getElementById("addexp_amt").style.display = "flex";
      document.getElementById("addexp_food").style.display = "none";
    }
    icon.classList.add("first-letter-badge");
    idisplayContainer.appendChild(icon);
  });

  //Category change in Edit expense
  edit_exp_category.addEventListener("change", () => {
    console.log("inside");
    const categoryIcons = {
      Transport: "fa-plane",
      Food: "fa-utensils",
      Fuel: "fa-gas-pump",
      Accomodation: "fa-bed",
      Ticket: "fa-ticket",
      Snacks: "fa-cookie-bite",
      Advance_Payment: "fa-indian-rupee-sign",
      Others: "fa-box",
    };

    const selectedOption =
      edit_exp_category.options[edit_exp_category.selectedIndex];
    console.log("inside", selectedOption);
    const iconClass = categoryIcons[selectedOption.value] || "fa-pen";
    const idisplayContainer = document.getElementById("edit_icon_display");
    idisplayContainer.innerHTML = "";
    idisplayContainer.style.border = "none";
    const icon = document.createElement("i");
    if (selectedOption.value === "Local_Transport") {
      icon.classList.add("fa-solid", "fa-car-side");
      icon.style.color = "red";
      document.getElementById("editexp_food").style.display = "none";
    } else {
      icon.classList.add("fa-solid", iconClass);
      document.getElementById("editexp_food").style.display = "none";
    }

    if (selectedOption.value === "Transport") {
      icon.style.color = "blue";
      document.getElementById("editexp_food").style.display = "none";
    }
    if (selectedOption.value === "Food") {
      icon.style.color = "brown";
      document.getElementById("editexp_food").style.display = "flex";
    }
    if (selectedOption.value === "Fuel") {
      icon.style.color = "teal";
      document.getElementById("editexp_food").style.display = "none";
    }
    if (selectedOption.value === "Accomodation") {
      icon.style.color = "chocolate";
      document.getElementById("editexp_food").style.display = "none";
    }
    if (selectedOption.value === "Ticket") {
      icon.style.color = "darkorange";
      document.getElementById("editexp_food").style.display = "none";
    }
    if (selectedOption.value === "Snacks") {
      icon.style.color = "brown";
      document.getElementById("editexp_food").style.display = "none";
    }
    if (selectedOption.value === "Advance_Payment") {
      icon.style.color = "green";
      document.getElementById("editexp_food").style.display = "none";
    }
    if (selectedOption.value === "Others") {
      icon.style.color = "orangered";
      document.getElementById("editexp_food").style.display = "none";
    }
    icon.classList.add("first-letter-badge");
    idisplayContainer.appendChild(icon);
  });

  document.querySelectorAll('input[name="editfoodoption"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
      let selectedValue = event.target.value;
      console.log("Selected value:", selectedValue);
      if (selectedValue === "No") {
        document.getElementById("editfoodshare").style.display = "none";
        document.getElementById("editexp_amt").style.display = "flex";
      }
      if (selectedValue === "Yes") {
        document.getElementById("editfoodshare").style.display = "flex";
        document.getElementById("editfoodamt").style.display = "none";
        document.getElementById("editexp_amt").style.display = "none";
        document
          .querySelectorAll('input[name="editfoodshare"]')
          .forEach((radio) => {
            radio.checked = false;
          });
      }
    });
  });

  document.querySelectorAll('input[name="editfoodshare"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
      let selectedValue = event.target.value;
      console.log("Selected value:", selectedValue);
      if (selectedValue === "60_40") {
        document.getElementById("editfoodamt").style.display = "none";
        document.getElementById("editexp_amt").style.display = "flex";
        document.getElementById("edit_exp_amt").value = 0;
      }
      if (selectedValue === "Yes") {
        document.getElementById("editfoodamt").style.display = "flex";
        document.getElementById("editexp_amt").style.display = "none";
        document.getElementById("editexp_veg").value = 0;
        document.getElementById("editexp_nveg").value = 0;
      }
    });
  });

  //Save Expense
  window.save_exp = async function () {
    let split_food = "No",
      veg = 0,
      nveg = 0,
      split_share = "NA";
    amount = 0;
    const guest_Id = guestId;
    const guestname = guestName;
    const flatNumber = guestFlatNumber;
    const category = document.getElementById("category").value;
    amount = document.getElementById("exp_amt").value.trim();
    const date = document.getElementById("exp_date").value;
    const trip_id = tripId;
    console.log("Amt = ", category);
    if (!category) {
      showNotification("Category is blank!", "N");
      return;
    }

    if (!guestname) {
      showNotification("Guest name is blank!", "N");
      return;
    }

    if (category === "Food") {
      const fo = document.querySelector('input[name="foodoption"]:checked');
      console.log("fo = ", fo.value);

      if (fo.value === "Yes") {
        split_food = "Yes";
        const fs = document.querySelector('input[name="foodshare"]:checked');
        console.log("fs = ", fs.value);
        if (fs.value === "60_40") {
          veg = amount * 0.4;
          nveg = amount * 0.6;
          split_share = "60_40";
        }
        if (fs.value === "Yes") {
          split_share = "NA";
          veg = document.getElementById("exp_veg").value;
          nveg = document.getElementById("exp_nveg").value;
          amount = Number(veg) + Number(nveg);
        }
      }
    }

    if (!amount || Number(amount) === 0) {
      showNotification("Amount is blank or zero!", "N");
      return;
    }

    console.log("amount", amount);
    console.log("Split_foold", split_food);
    console.log("veg", veg);
    console.log("nveg", nveg);
    console.log("split_share", split_share);

    console.log({
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount,
      date,
      split_food,
      veg,
      nveg,
      split_share,
    });
    try {
      const create_response = await fetch("/addexpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_Id,
          guestname,
          flatNumber,
          trip_id,
          category,
          amount,
          date,
          split_food,
          veg,
          nveg,
          split_share,
        }),
      });

      const create_result = await create_response.json();
      if (create_result.success) {
        showNotification("Expenses added!", "Y");
        document.getElementById("subheader").style.display = "flex";
        trip_main_details.style.display = "flex";
        addExp.style.display = "none";
        document.getElementById("subheader_add_expense").style.display = "none";
        trip_setting_back = true;
        try {
          const expense_req = await fetch(`/api/getexpenses/${tripId}`);
          expenses_res = await fetchExpenses();
          console.log("Save Edited Expenses = ", expenses_res);
        } catch (err) {
          console.error("Error:", err);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  //Save multiple Expense
  window.save_new_exp = async function () {
    let split_food = "No",
      veg = 0,
      nveg = 0,
      split_share = "NA";
    amount = 0;
    const guest_Id = guestId;
    const guestname = guestName;
    const flatNumber = guestFlatNumber;
    const category = document.getElementById("category").value;
    amount = document.getElementById("exp_amt").value.trim();
    const date = document.getElementById("exp_date").value;
    const trip_id = tripId;
    console.log("Amt = ", category);
    if (!category) {
      showNotification("Category is blank!", "N");
      return;
    }

    if (!guestname) {
      showNotification("Guest name is blank!", "N");
      return;
    }

    if (category === "Food") {
      const fo = document.querySelector('input[name="foodoption"]:checked');
      console.log("fo = ", fo.value);

      if (fo.value === "Yes") {
        split_food = "Yes";
        const fs = document.querySelector('input[name="foodshare"]:checked');
        console.log("fs = ", fs.value);
        if (fs.value === "60_40") {
          veg = amount * 0.4;
          nveg = amount * 0.6;
          split_share = "60_40";
        }
        if (fs.value === "Yes") {
          split_share = "NA";
          veg = document.getElementById("exp_veg").value;
          nveg = document.getElementById("exp_nveg").value;
          amount = Number(veg) + Number(nveg);
        }
      }
    }

    if (!amount || Number(amount) === 0) {
      showNotification("Amount is blank or zero!", "N");
      return;
    }

    console.log("amount", amount);
    console.log("Split_foold", split_food);
    console.log("veg", veg);
    console.log("nveg", nveg);
    console.log("split_share", split_share);

    console.log({
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount,
      date,
      split_food,
      veg,
      nveg,
      split_share,
    });
    try {
      const create_response = await fetch("/addexpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_Id,
          guestname,
          flatNumber,
          trip_id,
          category,
          amount,
          date,
          split_food,
          veg,
          nveg,
          split_share,
        }),
      });

      const create_result = await create_response.json();
      if (create_result.success) {
        showNotification("Expenses added!", "Y");
        document.getElementById("category").value = "";
        document.getElementById("exp_amt").value = "";
        document.getElementById("exp_date").value = "";
        document.getElementById("exp_guest").value = "";
        document
          .querySelectorAll('input[name="foodoption"]')
          .forEach((radio) => {
            radio.checked = false;
          });
        document
          .querySelectorAll('input[name="foodshare"]')
          .forEach((radio) => {
            radio.checked = false;
          });
        document.getElementById("icon_display").innerHTML = "";
        document.getElementById("icon_display_1").innerHTML = "";
        document.getElementById("addexp_food").style.display = "none";
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  //Cancel Add Exp
  window.cancel_exp = async function () {
    document.getElementById("subheader").style.display = "flex";
    trip_main_details.style.display = "flex";
    document.querySelector(".right-buttons").style.display = "flex";
    addExp.style.display = "none";
    document.getElementById("subheader_add_expense").style.display = "none";
    trip_setting_back = false;
  };

  //Cancel Edit exp
  window.cancel_edit_exp = async function () {
    document.getElementById("subheader").style.display = "flex";
    trip_main_details.style.display = "flex";
    document.querySelector(".right-buttons").style.display = "flex";
    document.getElementById("editexpense").style.display = "none";
  };

  //Save Edited exp
  window.save_edit_exp = async function () {
    let split_food = "No",
      veg = 0,
      nveg = 0,
      split_share = "NA";
    amount = 0;
    const guest_Id = guestId;
    const guestname = guestName;
    const flatNumber = guestFlatNumber;
    const category = document.getElementById("edit_category").value;
    amount = document.getElementById("edit_exp_amt").value.trim();
    const date = document.getElementById("edit_exp_date").value;
    const trip_id = tripId;
    console.log({
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount,
      date,
    });
    if (!category) {
      showNotification("Category is blank!", "N");
      return;
    }

    // if (!guestname) {
    //   showNotification("Guest name is blank!", "N");
    //   return;
    // }

    if (category === "Food") {
      const fo = document.querySelector('input[name="editfoodoption"]:checked');
      console.log("fo = ", fo.value);

      if (fo.value === "Yes") {
        split_food = "Yes";
        const fs = document.querySelector(
          'input[name="editfoodshare"]:checked'
        );
        console.log("fs = ", fs.value);
        if (fs.value === "60_40") {
          veg = amount * 0.4;
          nveg = amount * 0.6;
          split_share = "60_40";
        }
        if (fs.value === "Yes") {
          split_share = "NA";
          veg = document.getElementById("editexp_veg").value;
          nveg = document.getElementById("editexp_nveg").value;
          amount = Number(veg) + Number(nveg);
        }
      }
    }

    if (!amount || Number(amount) === 0) {
      showNotification("Amount is blank or zero!", "N");
      return;
    }

    console.log("amount", amount);
    console.log("Split_foold", split_food);
    console.log("veg", veg);
    console.log("nveg", nveg);
    console.log("split_share", split_share);
    console.log({
      guest_Id,
      guestname,
      flatNumber,
      trip_id,
      category,
      amount,
      date,
      split_food,
      veg,
      nveg,
      split_share,
    });
    try {
      const create_response = await fetch(`/api/updateexpense/${expense_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_Id,
          guestname,
          flatNumber,
          trip_id,
          category,
          amount,
          date,
          split_food,
          veg,
          nveg,
          split_share,
        }),
      });

      const create_result = await create_response.json();
      console.log(create_result);
      if (create_result.success) {
        showNotification("Expense Updated sucessfully!", "Y");
        document.getElementById("subheader").style.display = "flex";
        trip_main_details.style.display = "flex";
        addExp.style.display = "none";
        document.getElementById("editexpense").style.display = "none";
        document.querySelector(".right-buttons").style.display = "flex";
        trip_setting_back = true;
        try {
          const expense_req = await fetch(`/api/getexpenses/${tripId}`);
          expenses_res = await fetchExpenses();
          console.log("Save Edited Expenses = ", expenses_res);
        } catch (err) {
          console.error("Error:", err);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  window.gotoSummaryview = async function () {
    console.log(tripId);

    localStorage.setItem("selectedTripId", tripId);
    localStorage.setItem("selectedTripName", tripName);
    const url = `../html/summary.html?tripId=${encodeURIComponent(
      tripId
    )}&tripName=${encodeURIComponent(tripName)}`;
    window.location.href = url;
  };

  window.toggleview = async function (input) {
    if (input === "categorydetails") {
      document.getElementById("viewcategories").classList.add("show");
      document.getElementById("allexpenses").classList.remove("show");
      cat_list.style.display = "flex";
      exp_list.style.display = "none";
      document.getElementById("exp_count").style.display = "none";
      showcategoryview(expense_list, guest_list);
    }
    if (input === "expensedetails") {
      document.getElementById("viewcategories").classList.remove("show");
      document.getElementById("allexpenses").classList.add("show");
      document.getElementById("exp_count").style.display = "block";
      cat_list.style.display = "none";
      exp_list.style.display = "flex";
    }
  };

  function showcategoryview(exp, guest) {
    console.log(exp);
    console.log(guest);
    exp_list.style.display = "none";
    cat_list.style.display = "flex";

    const categoryTotals = {};

    exp.forEach((exp) => {
      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }
      categoryTotals[exp.category] += exp.amount;
    });

    // Convert to array format
    const output = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));
    console.log(output);
    const category_container = document.getElementById("category_list");
    category_container.innerHTML = "";

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

      category_container.appendChild(card);

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
  }

  function showfoodoption() {
    const split_amt = document.getElementById("foodoption").value;
    console.log(split_amt);
  }
});

function showPopup() {
  document.getElementById("popup_delete_group").style.display = "flex";
}

function hidePopup() {
  document.getElementById("popup_delete_group").style.display = "none";
}

function hidedeletePopup() {
  document.getElementById("popup_delete_guest").style.display = "none";
}

function hideExpdeletePopup() {
  document.getElementById("popup_delete_exp").style.display = "none";
}

function closeForm_pp() {
  document.getElementById("pp_popupForm").style.display = "none";
}

function closeEditForm_pp() {
  document.getElementById("pp_edit_popupForm").style.display = "none";
}

function showNotification(message, flg, duration = 3000) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");
  if (flg === "N") notification.classList.add("error_msg");

  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.remove("error_msg");
  }, duration);
}

function delete_exp(expid) {
  console.log(expid);
  document.getElementById("popup_delete_exp").style.display = "flex";
}
