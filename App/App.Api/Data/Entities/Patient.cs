namespace App.Api.Data.Entities
{
    public class Patient
    {
        public int Id { get; set; } // Primary Key
        public string AnimalName { get; set; } // Örn: Pamuk
        public string Species { get; set; } // Türü: Kedi, Köpek...
        public string Breed { get; set; } // Cinsi: Tekir, Golden...
        public string OwnerName { get; set; } // Sahibinin Adı
        public string TreatmentDescription { get; set; } // Şikayet/Tedavi
        public DateTime? VisitDate { get; set; } // Geliş Tarihi
        public bool IsVaccinated { get; set; } // Aşıları Tam mı?
    }
}
