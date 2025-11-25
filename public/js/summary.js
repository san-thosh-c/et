document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get("tripId");
  const tripName = urlParams.get("tripName");
  const theme = localStorage.getItem("selectedTheme");
  document.body.className = "";
  document.body.classList.add(theme);
  document.getElementById("tripname").innerHTML = tripName + " Summary";
  const backBtn = document.getElementById("summary_back");
  document.getElementById("exportBtn").addEventListener("click", exportToExcel);

  backBtn.onclick = () => {
    const url = `../html/tripdetails.html?tripId=${encodeURIComponent(
      tripId
    )}&tripName=${encodeURIComponent(tripName)}`;
    window.location.href = url;
  };

  async function fetchExpenses() {
    try {
      const expense_req = await fetch(`/api/getexpenses/${tripId}`);
      return await expense_req.json();
    } catch (err) {}
  }

  async function fetchGuest() {
    try {
      const guest_req = await fetch(`/api/guest/${tripId}`);
      return await guest_req.json();
    } catch (err) {}
  }

  const [expenses_res, guest_res] = await Promise.all([
    fetchExpenses(),
    fetchGuest(),
  ]);
  console.log(expenses_res);
  console.log(guest_res);
  const totalAdults = guest_res.reduce((sum, g1) => sum + g1.adults, 0);
  const totalKids = guest_res.reduce((sum, g2) => sum + g2.kids, 0);
  const totalVeg = guest_res.reduce((sum, g3) => sum + g3.veg, 0);
  const totalNVeg = guest_res.reduce((sum, g4) => sum + g4.nonVeg, 0);
  const total = Number(totalAdults) + Number(totalKids);
  document.getElementById("t_count").innerHTML = total;
  document.getElementById("a_count").innerHTML = Number(totalAdults);
  document.getElementById("k_count").innerHTML = Number(totalKids);
  document.getElementById("v_count").innerHTML = Number(totalVeg);
  document.getElementById("n_count").innerHTML = Number(totalNVeg);

  const financiers = guest_res
    .filter((guest) => guest.financier === true)
    .map((guest) => guest._id)
    .join(",");
  console.log(financiers);

  const transportTotal = expenses_res
    .filter((item) => item.category === "Transport")
    .reduce((sum, item) => sum + item.amount, 0);
  console.log(transportTotal);

  const commonExp = expenses_res
    .filter(
      (item) =>
        item.category !== "Advance_Payment" &&
        item.category !== "Transport" &&
        item.category !== "Food"
    )
    .reduce((sum, item) => sum + item.amount, 0);
  console.log(commonExp);

  const foodtotal = expenses_res.filter((item) => item.category === "Food");

  let totalVegAmt = 0;
  let totalNvegAmt = 0;
  let totalAmount = 0;

  foodtotal.forEach((item) => {
    if (item.split_food === "Yes") {
      totalVegAmt += item.veg ? item.veg : 0;
      totalNvegAmt += item.nveg ? item.nveg : 0;
    } else {
      totalAmount += item.amount;
    }
  });

  console.log("totalVegAmt = ", totalVegAmt);
  console.log("totalNvegAmt = ", totalNvegAmt);
  console.log("totalAmount = ", totalAmount);

  const categoryTotals = {};
  expenses_res.forEach((exp) => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += exp.amount;
  });

  const output = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));
  console.log(output);

  let step1 = await final_summary1(guest_res);
  let step2 = await final_summary2(expenses_res);
  let step3 = await final_summary3(step1, step2);
  let step4 = await final_summary4(expenses_res);
  let step5 = await final_summary5(output);
  let step6 = await financier_cal(step4, financiers, step5); //financier Spent Amount
  let step7 = await fs_6(step3, step4, step6, financiers);
  let step8 = await Calc(
    transportTotal,
    step7,
    total,
    commonExp,
    totalAdults,
    totalVegAmt,
    totalNvegAmt,
    totalAmount
  );
  let step9 = await final_calc(step8);
  console.log("step1 = ", step1);
  console.log("step2 = ", step2);
  console.log("step3 = ", step3);
  console.log("step4 = ", step4);
  console.log("step5 = ", step5);
  console.log("step6 = ", step6); //financier Spent Amount
  console.log("step7 = ", step7);
  console.log("step8 = ", step8);
  console.log("step9 = ", step9);

  async function final_summary1(guests) {
    console.log(guests);

    try {
      let output = [];
      for (let guest of guests) {
        let dataobj = {};
        dataobj.id = guest._id;
        dataobj.guestName = guest.guestname;
        dataobj.flatNumber = guest.flatNumber;
        dataobj.headcount = Number(guest.adults) + Number(guest.kids);
        dataobj.totalVeg = Number(guest.veg);
        dataobj.totalNveg = Number(guest.nonVeg);
        dataobj.isFinancier = guest.financier;
        output.push(dataobj);
      }
      return output;
    } catch (err) {}
  }

  async function final_summary2(expense) {
    try {
      const grouped = expense.reduce((acc, item) => {
        const flat = item.flatNumber;
        if (!acc[flat]) {
          acc[flat] = 0;
        }
        acc[flat] += item.amount;
        return acc;
      }, {});
      const result = Object.entries(grouped).map(
        ([flatNumber, total_amount]) => ({
          flatNumber,
          total_amount,
        })
      );
      return result;
    } catch (err) {}
  }

  async function final_summary3(step1, step2) {
    try {
      console.log(step1);
      console.log(step2);
      const amountMap = new Map(
        step2.map((item) => [item.flatNumber, item.total_amount])
      );

      const mergedArray = step1.map((item) => ({
        ...item,
        total_amount: amountMap.get(item.flatNumber) || 0,
      }));

      return mergedArray;
    } catch (err) {}
  }

  async function final_summary4(exp) {
    try {
      const grouped = exp.reduce((acc, item) => {
        const flat = item.flatNumber;
        const guestId = item.guest_Id;
        if (!acc[flat]) {
          acc[flat] = {
            guestId: guestId,
            flatNumber: flat,
            totalAmount: 0,
            categories: {},
            guests: [],
          };
        }

        // Add amount
        acc[flat].totalAmount += item.amount;

        // Track category-wise amount
        acc[flat].categories[item.category] =
          (acc[flat].categories[item.category] || 0) + item.amount;

        // Add guest info
        acc[flat].guests.push({
          guest_Id: item.guest_Id,
          guestname: item.guestname,
          amount: item.amount,
          category: item.category,
        });

        return acc;
      }, {});

      // Convert to array
      return (result = Object.values(grouped));
    } catch (err) {}
  }

  async function final_summary5(output) {
    try {
      let sum = 0;
      const ap = output.filter((obj) => obj.category === "Advance_Payment");
      if (ap.length > 0) {
        for (let t1 of ap) {
          sum += t1.amount;
        }
      }
      return sum;
    } catch (err) {}
  }

  async function financier_cal(step4, financierId, stp5) {
    try {
      let financieramt = 0;
      let financierspentamt = 0;
      const findFinancier = step4.filter((obj) => obj.guestId === financierId);
      if (findFinancier.length > 0) {
        financieramt = Number(stp5) - Number(findFinancier[0].totalAmount);
        let ap_amt = findFinancier[0].categories.Advance_Payment;
        financierspentamt = Math.abs(financieramt) - Number(ap_amt);
      }
      return Math.abs(financierspentamt);
    } catch (err) {}
  }

  async function fs_6(stp3, stp4, stp6, financierId) {
    console.log("stp3 = ", stp3);
    console.log("stp4 = ", stp4);
    console.log("stp6 = ", stp6);
    console.log("financierId = ", financierId);
    try {
      let ap_amt;
      let final = [];
      for (let t1 of stp3) {
        const t1_obj = stp4.filter((obj) => obj.guestId === t1.id);
        if (t1_obj.length > 0) {
          ap_amt = t1_obj[0].categories.Advance_Payment;
          let dataobj = {};
          dataobj.flatNumber = t1.flatNumber;
          dataobj.guestName = t1.guestName;
          dataobj.guestId = t1.id;
          dataobj.headcount = t1.headcount;
          dataobj.totalNveg = t1.totalNveg;
          dataobj.totalVeg = t1.totalVeg;
          dataobj.advance_amt = ap_amt;
          if (t1.isFinancier === true && t1.id === financierId) {
            dataobj.spent = stp6;
            dataobj.totalpaid = ap_amt + stp6;
          } else {
            dataobj.spent = Math.abs(Number(ap_amt) - t1.total_amount);
            dataobj.totalpaid = t1.total_amount;
          }

          final.push(dataobj);
        }
      }
      return final;
    } catch (err) {}
  }

  async function Calc(
    transportTotal,
    step7,
    total,
    commonExp,
    totalAdults,
    totalVegAmt,
    totalNVegAmt,
    totalFoodAmt
  ) {
    try {
      const perheadTransportCost = (transportTotal / total).toFixed(2);
      console.log("totalAdults = ", totalAdults);
      const common = (commonExp / totalAdults).toFixed(2);
      const vegAmt = (totalVegAmt / totalAdults).toFixed(2);
      const nonVegAmt = (totalNVegAmt / totalAdults).toFixed(2);
      const FoodAmt = (totalFoodAmt / totalAdults).toFixed(2);
      for (let t1 of step7) {
        let temp = Number(common * t1.headcount).toFixed(2);
        let temp1_veg = Number(vegAmt) * t1.totalVeg;
        let temp2_Nveg = Number(nonVegAmt) * t1.totalNveg;
        let temp3_TotalFood = Number(FoodAmt) * t1.headcount;
        t1.transportPerHead = Number(perheadTransportCost);
        t1.totalTransportAmt = Number(perheadTransportCost) * t1.headcount;
        t1.commonExp = Number(common);
        t1.totalCommonAmt = temp;
        t1.vegAmt = Number(temp1_veg).toFixed(2);
        t1.nonVegAmt = Number(temp2_Nveg).toFixed(2);
        t1.foodAmt = Number(temp3_TotalFood).toFixed(2);
        t1.totalFoodAmt = Number(
          temp1_veg + temp3_TotalFood + temp2_Nveg
        ).toFixed(2);
      }
      return step7;
    } catch (err) {}
  }

  async function final_calc(step8) {
    try {
      for (let t1 of step8) {
        let temp =
          Number(t1.totalTransportAmt) +
          Number(t1.totalCommonAmt) +
          Number(t1.totalFoodAmt);
        t1.totalExpenses = Number(temp).toFixed(2);
        let balance = Number(temp) - Number(t1.totalpaid);
        if (balance < 0) {
          t1.toSend = 0;
          t1.toReceive = Number(balance).toFixed(2);
        }
        if (balance > 0) {
          t1.toSend = Number(balance).toFixed(2);
          t1.toReceive = 0;
        }
      }
      return step8;
    } catch (err) {}
  }

  const container = document.getElementById("card-container");

  step9.forEach((item) => {
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

    cardMiddleLeft.innerHTML = `<h6>${item.headcount}</h6>`;
    cardMiddleRight.innerHTML = `<h6><i class="fa-solid fa-carrot" style="color: green;  margin-right: 5px; font-size: 15px;"></i>${item.totalVeg} <i class="fa-solid fa-fish-fins" style="color: red;margin-right: 5px; font-size: 15px;transform: rotate(315deg);"></i>${item.totalNveg}</h6>`;

    const cardBottom = document.createElement("div");
    cardBottom.className = "cardBottom";

    const cardBottomLeft = document.createElement("div");
    cardBottomLeft.className = "cardBottomLeft";

    const cardBottomRight = document.createElement("div");
    cardBottomRight.className = "cardBottomRight";

    cardBottomLeft.innerHTML = `<h6>Spent: <br>₹ ${item.totalpaid.toLocaleString(
      "en-IN"
    )}</h6>`;
    if (item.toSend === 0) {
      cardBottomRight.innerHTML = `<h6 style="color: green;">To Receive: <br>₹ ${Math.abs(
        Number(item.toReceive)
      ).toLocaleString("en-IN")}</h6>`;
    } else {
      cardBottomRight.innerHTML = `<h6 style="color: red;">To Send: <br> ₹ ${Number(
        item.toSend
      ).toLocaleString("en-IN")}</h6>`;
    }

    const cardLeft = document.createElement("div");
    cardLeft.className = "cardLeft";
    const cardRight = document.createElement("div");
    cardRight.className = "cardRight";

    // cardLeft.innerHTML = `<h5><i class="fa-etch fa-solid fa-user"></i>${item.guestName}</h5>`;
    //cardRight.innerHTML = `<h5><i class="fa-solid fa-house"></i>${item.flatNumber}</h5>`;
    cardLeft.innerHTML = `<h5>${item.guestName}</h5>`;
    cardRight.innerHTML = `<h5>${item.flatNumber}</h5>`;

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
    card.addEventListener("click", () => {
      localStorage.setItem("selectedTripId", tripId);
      localStorage.setItem("selectedTripName", tripName);
      localStorage.setItem("selectedFamily", JSON.stringify(item));
      localStorage.setItem("flatNumber", item.flatNumber);
      const url = `../html/summarydetail.html?tripId=${encodeURIComponent(
        tripId
      )}&tripName=${encodeURIComponent(
        tripName
      )}&flatNumber=${encodeURIComponent(item.flatNumber)}`;
      window.location.href = url;
    });
  });

  function exportToExcel() {
    const summary = {
      flatNumber: "TOTAL",
      guestName: "",
      headcount: step9.reduce((sum, item) => sum + item.headcount, 0),
      totalVeg: step9.reduce((sum, item) => sum + item.totalVeg, 0),
      totalNveg: step9.reduce((sum, item) => sum + item.totalNveg, 0),
      advance_amt: step9.reduce((sum, item) => sum + item.advance_amt, 0),
      spent: step9.reduce((sum, item) => sum + item.spent, 0),
      totalpaid: step9.reduce((sum, item) => sum + item.totalpaid, 0),
      totalTransportAmt: step9.reduce(
        (sum, item) => sum + Number(item.totalTransportAmt),
        0
      ),
      totalCommonAmt: step9.reduce(
        (sum, item) => sum + Number(item.totalCommonAmt),
        0
      ),
      totalFoodAmt: step9.reduce(
        (sum, item) => sum + Number(item.totalFoodAmt),
        0
      ),
      totalExpenses: step9.reduce(
        (sum, item) => sum + Number(item.totalExpenses),
        0
      ),
      toSend: step9.reduce((sum, item) => sum + Number(item.toSend), 0),
      toReceive: step9.reduce(
        (sum, item) => sum + Math.abs(Number(item.toReceive)),
        0
      ),
    };

    const exportData = step9
      .map((item) => ({
        ...item,
        toReceive: Math.abs(Number(item.toReceive)),
      }))
      .sort((a, b) => {
        const numA = parseInt(a.flatNumber, 10);
        const numB = parseInt(b.flatNumber, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.flatNumber.localeCompare(b.flatNumber);
      });

    exportData.push(summary);
    console.log("********=>", exportData);
    const headers = [
      "Flat Number",
      "Guest Name",
      "Guest Id",
      "Headcount",
      "Veg",
      "Non-Veg",
      "Advance Amount",
      "Spent",
      "Total Paid",
      "Transport / Head",
      "Transport Amount",
      "Common Exp / Head",
      "Common Amount",
      "Veg Amount",
      "NonVeg Amount",
      "Food Amount",
      "Total Food Amount",
      "Total Expenses",
      "To Send",
      "To Receive",
    ];
    const ws = XLSX.utils.json_to_sheet(exportData, {
      header: Object.keys(exportData[0]),
    });

    headers.forEach((header, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      ws[cellRef].v = header;
    });

    const moneyCols = [
      "advance_amt",
      "spent",
      "totalpaid",
      "transportPerHead",
      "totalTransportAmt",
      "commonExp",
      "totalCommonAmt",
      "vegAmt",
      "nonVegAmt",
      "foodAmt",
      "totalFoodAmt",
      "totalExpenses",
      "toSend",
      "toReceive",
    ];
    moneyCols.forEach((col) => {
      const colIndex = Object.keys(exportData[0]).indexOf(col);
      if (colIndex >= 0) {
        for (let i = 2; i <= exportData.length + 1; i++) {
          const cellRef = XLSX.utils.encode_cell({ r: i - 1, c: colIndex });
          if (ws[cellRef]) {
            ws[cellRef].t = "n";
            ws[cellRef].z = '"₹ "#,##0.00';
          }
        }
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tripName + " Expenses");
    XLSX.writeFile(wb, "guest_expenses.xlsx");
  }
});
