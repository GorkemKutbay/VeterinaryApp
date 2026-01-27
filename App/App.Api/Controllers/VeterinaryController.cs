using App.Api.Data;
using App.Api.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VeterinaryController : ControllerBase
    {
        public readonly VeterinaryContext dbContext;
        public VeterinaryController(VeterinaryContext _dbcontext)
        {
            dbContext = _dbcontext;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await dbContext.Patients.ToListAsync();
            return Ok(patients);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await dbContext.Patients.FindAsync(id);
            if (patient == null)
            {
                return BadRequest("Aradığınız hasta bulunamadı.");
            }
            return Ok(patient);
        }
        [HttpPost]
        public async Task<IActionResult> AddPatient([FromBody] Patient patient)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);

            }
            patient.Id = 0;
            await dbContext.Patients.AddAsync(patient);
            await dbContext.SaveChangesAsync();
            return Ok(patient);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient([FromRoute] int id, [FromBody] Patient patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (patient.Id != id)
            {
                return BadRequest("Güncellemek istediğiniz Id ler uyuşmuyor.");
            }
            dbContext.Entry(patient).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
            return Ok("Hasta güncellendi.");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = dbContext.Patients.Find(id);
            if (patient == null)
            {
                return BadRequest("Silmek istediğiniz Hasta bulunamadı.");
            }
            dbContext.Patients.Remove(patient);
            await dbContext.SaveChangesAsync();
            return Ok("Hasta Kaldırıldı");
        }
    }
}
