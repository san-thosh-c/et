document.addEventListener("DOMContentLoaded", async () => {
const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get('tripId');
const tripName = urlParams.get('tripName');
let trip_setting_back = false;

const name = document.getElementById('tripname');
const trip_home_back = document.getElementById('triphome_back');
const trip_setting_icon = document.getElementById('trip_settings_icon');
const trip_main_details = document.getElementById('trip_main_details');
const trip_settings_view = document.getElementById('trip_settings');
const pp_popup = document.getElementById("pp_popupForm");
const addBtn = document.getElementById('addparticipants');

const gm_members = document.getElementById('gm_members');


name.textContent = tripName;
document.getElementById('trip_adult').innerHTML = `# of Adults: 18`;
document.getElementById('trip_veg').innerHTML = `# of Veg: 18`;
document.getElementById('trip_kids').innerHTML = `# of Kids: 18`;
document.getElementById('trip_nv').innerHTML = `# of Non-Veg: 18`;

try{
    const response = await fetch(`/api/guest/${tripId}`);
    const guests = await response.json();
    console.log("************=>", guests);
    const container = gm_members;
    container.innerHTML = "";
    const totalPersons = guests.reduce((sum, guest) => sum + guest.adults + guest.kids, 0);
    document.getElementById('numberofpp').innerHTML = totalPersons + " Participants";
    const totaladults = guests.reduce((sum, g1) => sum + g1.adults, 0);
    const totalkids = guests.reduce((sum, g2) => sum + g2.kids, 0);
    const totalveg = guests.reduce((sum, g3) => sum + g3.veg, 0);
    const totalnv = guests.reduce((sum, g4) => sum + g4.nonVeg, 0);

    document.getElementById('trip_adult').innerHTML = `# of Adults: ${totaladults}`;
    document.getElementById('trip_veg').innerHTML = `# of Veg: ${totalveg}`;
    document.getElementById('trip_kids').innerHTML = `# of Kids: ${totalkids}`;
    document.getElementById('trip_nv').innerHTML = `# of Non-Veg: ${totalnv}`;

    guests.forEach((guest) => {
            const firstLetter = guest.guestname.charAt(0);
            const total_pp = Number(guest.adults) + Number(guest.kids);
            const card = document.createElement("div");
            card.className = "guest-card";    
            
            const cardLeft = document.createElement("div");
            cardLeft.className = "first-letter-badge";
            cardLeft.innerHTML = firstLetter;

            const cardRight = document.createElement("div");
            cardRight.className = "guest-details";

            const cardRight_top = document.createElement("p");
            cardRight_top.className = "guest-name";
            cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;

            const cardRight_btm = document.createElement("p");
            cardRight_btm.className = "guest-flat";
            cardRight_btm.innerHTML = total_pp + " participants";

            const card_end = document.createElement("div");
            card_end.className = "guest-change";
            const cardEnd_icon1 = document.createElement("i");
            cardEnd_icon1.className = "fa-solid fa-pen";  
            const cardEnd_icon2 = document.createElement("i");
            cardEnd_icon2.className = "fa-solid fa-trash";

            card_end.appendChild(cardEnd_icon1);
            card_end.appendChild(cardEnd_icon2);
            
            cardRight.appendChild(cardRight_top);
            cardRight.appendChild(cardRight_btm);
            card.appendChild(cardLeft);
            card.appendChild(cardRight);
            card.appendChild(card_end);
            container.appendChild(card);
        
    });


}catch(err) {
    console.error("Error fetching Guest records:", err);
    res.status(500).json({ error: "Failed to fetch Guest records" });
}

trip_home_back.onclick = () => {
    console.log(trip_setting_back);
    if (trip_setting_back){
        console.log("1");
        trip_main_details.style.display = 'block';
        trip_settings_view.style.display = 'none';
        name.textContent = tripName;
        document.querySelector('.right-buttons').style.display = 'flex';
        trip_setting_back = false;
    }
    else {
        window.location.href = '../html/index.html';    
    }
}

trip_setting_icon.onclick = () =>{
    trip_setting_back = true;
    trip_main_details.style.display = 'none';
    trip_settings_view.style.display = 'block';
    name.textContent = "Trip Settings";
    document.querySelector('.right-buttons').style.display = 'none';
    document.getElementById('trip_setting_tripname').textContent = tripName;
}

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
};

window.closeForm = function(){
    pp_popup.style.display = "none";
}

window.closeForm_pp = function(){
    pp_popup.style.display = "none";
}

window.submitForm = async function () {
    const guestname = document.getElementById("guestname").value;
    const flatNumber = document.getElementById("flatNumber").value;
    const adults = document.getElementById("noOfAdults").value;
    const kids = document.getElementById("noOfKids").value;
    const noofVeg = document.getElementById("veg").value;
    const noofNonVeg = document.getElementById("nv").value;
    const trip_id = tripId; 
    console.log({ guestname, flatNumber, adults, kids, noofVeg, noofNonVeg, trip_id });
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
        }),
    });

    const create_result = await create_response.json();

    if (create_result.success) {
        showNotification("Guest added successfully!");
                const response = await fetch(`/api/guest/${tripId}`);
                const guests = await response.json();
                console.log("************=>", guests);
                const container = gm_members;
                container.innerHTML = "";
                const totalPersons = guests.reduce((sum, guest) => sum + guest.adults + guest.kids, 0);
                document.getElementById('numberofpp').innerHTML = totalPersons + " Participants";

                const totaladults = guests.reduce((sum, g1) => sum + g1.adults, 0);
                const totalkids = guests.reduce((sum, g2) => sum + g2.kids, 0);
                const totalveg = guests.reduce((sum, g3) => sum + g3.veg, 0);
                const totalnv = guests.reduce((sum, g4) => sum + g4.nonVeg, 0);
                document.getElementById('trip_adult').innerHTML = `# of Adults: ${totaladults}`;
                document.getElementById('trip_veg').innerHTML = `# of Veg: ${totalveg}`;
                document.getElementById('trip_kids').innerHTML = `# of Kids: ${totalkids}`;
                document.getElementById('trip_nv').innerHTML = `# of Non-Veg: ${totalnv}`;                

                guests.forEach((guest) => {
                        const firstLetter = guest.guestname.charAt(0);
                        const total_pp = Number(guest.adults) + Number(guest.kids);
                        const card = document.createElement("div");
                        card.className = "guest-card";    
                        
                        const cardLeft = document.createElement("div");
                        cardLeft.className = "first-letter-badge";
                        cardLeft.innerHTML = firstLetter

                        const cardRight = document.createElement("div");
                        cardRight.className = "guest-details";

                        const cardRight_top = document.createElement("p");
                        cardRight_top.className = "guest-name";
                        cardRight_top.innerHTML = `${guest.guestname} (${guest.flatNumber})`;

                        const cardRight_btm = document.createElement("p");
                        cardRight_btm.className = "guest-flat";
                        cardRight_btm.innerHTML = total_pp + " participants";

                        const card_end = document.createElement("div");
                        card_end.className = "guest-change";

                                            
                        cardRight.appendChild(cardRight_top);
                        cardRight.appendChild(cardRight_btm);
                        card.appendChild(cardLeft);
                        card.appendChild(cardRight);
                        card.appendChild(card_end);    
                        container.appendChild(card);                    
                });
    } else {
        showNotification(create_result.message);
    }
    } catch (err) {
    console.error("Error:", err);
    }
    closeForm();
}

window.confirmDelete = async function () {
  console.log("Deleting guests and trip for tripId:", tripId);

  try {
    const guestResponse = await fetch(`/api/guest/${tripId}`, {
      method: 'DELETE',
    });

    if (!guestResponse.ok) {
      throw new Error("Failed to delete guests");
    }

    const guestResult = await guestResponse.json();
    console.log("Guests deleted:", guestResult);

    const tripResponse = await fetch(`/api/trip/${tripId}`, {
      method: 'DELETE',
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


});

function showPopup() {
  document.getElementById("popup_delete_group").style.display = "flex";
}

function hidePopup() {
  document.getElementById("popup_delete_group").style.display = "none";
}

function showNotification(message, duration = 3000) {
const notification = document.getElementById("notification");
notification.textContent = message;
notification.classList.add("show");

setTimeout(() => {
    notification.classList.remove("show");
}, duration);
}


