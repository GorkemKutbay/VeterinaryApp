using App.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Data
{
    public class VeterinaryContext:DbContext
    {
        public VeterinaryContext(DbContextOptions<VeterinaryContext> options):base(options)
        {
            
        }
        public DbSet<Patient> Patients {  get; set; }
    }
}
