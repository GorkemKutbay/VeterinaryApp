
const modal = new bootstrap.Modal(document.getElementById("mainModal"));


function openNewPatientModal() {
    document.getElementById("modalTitle").innerText = "Yeni Hasta Ekle";

    document.getElementById("modalBody").innerHTML = `
    <form onsubmit="event.preventDefault(); addPatient();">
        <label class="form-label"><b>Hayvan Adı</b></label>
        <input type="text" id="AnimalName" name="AnimalName" class="form-control" required>

        <label class="form-label mt-2"><b>Türü</b></label>
        <input type="text" id="Species" name="Species" class="form-control">

        <label class="form-label mt-2"><b>Cinsi</b></label>
        <input type="text" id="Breed" name="Breed" class="form-control">

        <label class="form-label mt-2"><b>Sahibinin Adı</b></label>
        <input type="text" id="OwnerName" name="OwnerName" class="form-control">

        <label class="form-label mt-2"><b>Tedavi Açıklaması</b></label>
        <textarea id="TreatmentDescription" name="TreatmentDescription"  class="form-control"></textarea>

        <label class="form-label mt-2"><b>Ziyaret Tarihi</b></label>
        <input type="date" id="VisitDate" name="VisitDate" class="form-control">

        <div class="form-check mt-3">
            <input class="form-check-input"  name="IsVaccinated" type="checkbox" id="IsVaccinated">
            <label class="form-check-label">Aşıları Tam</label>
        </div>

        <div class="modal-footer px-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
            <button type="submit" class="btn btn-primary">Ekle</button>
        </div>
    </form>
    `;

    modal.show();
}


function addPatient() {
    const visitDateValue = document.getElementById("VisitDate").value;

    const patient = {
        AnimalName: document.getElementById("AnimalName").value,
        Species: document.getElementById("Species").value,
        Breed: document.getElementById("Breed").value,
        OwnerName: document.getElementById("OwnerName").value,
        TreatmentDescription: document.getElementById("TreatmentDescription").value,
        VisitDate: visitDateValue ? visitDateValue : new Date().toISOString(),
        IsVaccinated: document.getElementById("IsVaccinated").checked
    };

    fetch("https://localhost:7163/api/veterinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient)
    })
        .then(res => {
            if (!res.ok) throw new Error("Kayıt başarısız");
            return res.json();
        })
        .then(() => {
            modal.hide();
            loadPatients();
        })
        .catch(err => {
            console.error(err);
            alert("Hasta eklenirken hata oluştu");
        });
}



document.addEventListener("DOMContentLoaded", () => {
    loadPatients();
});
function loadPatients() {
    fetch("https://localhost:7163/api/veterinary")
        .then(res => res.json())
        .then(data => {
            document.getElementById("patientList").innerHTML = "";
            data.forEach(p => createPatientCard(p));
        });
}

function createPatientCard(p) {
    const patientList = document.getElementById("patientList");

    const card = `
        <div class="col">
            <div class="card" style="width:18rem; border-radius:12px;">
                <div class="Header"></div>

                <div class="card-body position-relative">
                    <span class="badge rounded-pill bg-warning text-dark position-absolute top-0 end-0 mt-3 me-3">
                        ${p.species || "Bilinmiyor"}
                    </span>

                    <h5 class="card-title fw-bold">${p.animalName}</h5>

                    <p class="mb-1"><strong>Cins:</strong> ${p.breed || "-"}</p>
                    <p><strong>Sahip:</strong> ${p.ownerName || "-"}</p>

                    <div class="d-flex">
                        <button
                            class="btn btn-primary me-2"
                            style="width:100px;"
                            data-id="${p.id}"
                            onclick="openEditPatientModal(this)"
                        >
                        Düzenle
                        </button>

                        <button 
                        class="btn btn-danger"
                        style="width:100px;"
                        data-id="${p.id}"
                        onclick="deletePatient(this)"
                        >
                         Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    patientList.insertAdjacentHTML("beforeend", card);
}
let editingPatient = null;

function openEditPatientModal(btn) {
    const id = btn.dataset.id;

    fetch(`https://localhost:7163/api/veterinary/${id}`)
        .then(res => res.json())
        .then(p => {
            editingPatient = p;

            document.getElementById("modalTitle").innerText = "Hasta Düzenle";
            document.getElementById("modalBody").innerHTML = `
                <form onsubmit="event.preventDefault(); updatePatient();">
                    <label class="form-label"><b>Hayvan Adı</b></label>
                    <input type="text" id="AnimalName" class="form-control" value="${p.animalName}" required>

                    <label class="form-label mt-2"><b>Tedavi Açıklaması</b></label>
                    <textarea id="TreatmentDescription" class="form-control">${p.treatmentDescription || ""}</textarea>

                    <div class="modal-footer px-0 mt-3">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                        <button type="submit" class="btn btn-primary">Kaydet</button>
                    </div>
                </form>
            `;

            modal.show();
        });
}


function deletePatient(btn) {
    const id = btn.dataset.id;

    if (!confirm("Bu hastayı silmek istediğine emin misin?")) return;

    fetch(`https://localhost:7163/api/veterinary/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) throw new Error("Silme başarısız");

            
            const cardCol = btn.closest(".col");
            cardCol.remove();
        })
        .catch(err => {
            console.error(err);
            alert("Hasta silinirken hata oluştu");
        });
}
function updatePatient() {
    editingPatient.animalName = document.getElementById("AnimalName").value;
    editingPatient.treatmentDescription =
        document.getElementById("TreatmentDescription").value;

    fetch(`https://localhost:7163/api/veterinary/${editingPatient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPatient)
    })
    .then(res => {
        if (!res.ok) throw new Error("Güncelleme başarısız");
        
    })
    .then(() => {
        modal.hide();
        loadPatients();
    })
    .catch(err => {
        console.error(err);
        alert("Güncelleme hatası");
    });
}






