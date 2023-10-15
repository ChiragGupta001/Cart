using Core_Test_Dal.Data;
using Core_Test_Dal.Models;
using Core_Test_Dal.RepositoryInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Core_Test_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ItemController : ControllerBase
    {
        public readonly IGenericCrud<Item> _genericCrud;
        public readonly TestContext _testContext;
        public readonly IitemServices<Item> _itemServics;

        public ItemController(IGenericCrud<Item> genericCrud, TestContext context, IitemServices<Item> itemServics)
        {
            _genericCrud = genericCrud;
            _testContext = context;
            _itemServics = itemServics;
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("GetProduct")]
        public async Task<ActionResult<List<Item>>> GetProduct(int pagesize,int pageNum)
        {
            var result = await _genericCrud.GetAll();
            if(result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("GetById/{id}")]
        public async Task<ActionResult<List<Item>>> GetById(Guid id)
        {
            return Ok(await _genericCrud.GetById(id));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("AddProduct")]
        public async Task<ActionResult<List<Item>>> AddProduct([FromForm] ItemDto items)
        {
            Item item = new Item();
            item.Id = new Guid();
            item.Image = await _itemServics.UploadedFile(items.Image);
            item.Name = items.Name;
            item.Description = items.Description;
            item.Price = items.Price;
            item.Category = items.Category;
            item.Quantity = items.Quantity;
            _genericCrud.Insert(item);
            _genericCrud.Save();
            return Ok();
        }

        [HttpGet("search")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> Search(string sortOrder, string sortDirection, string ?searchTerm, int pageSize, int pageNumber) 
        {
            var result = await _itemServics.sortData(sortOrder,  sortDirection, searchTerm, pageSize, pageNumber);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateProduct/{id}")]
        public async Task<ActionResult<List<Item>>> UpdateProduct([FromForm]ItemDtos items)
        {
            Item item = new Item();
            item = await _genericCrud.GetById(items.Id);
                if(item != null) {
                if (items.Image != null)
                {
                    item.Image = await _itemServics.UploadedFile(items.Image);
                }
                item.Name = items.Name;
                item.Description = items.Description;
                item.Price = items.Price;
                item.Category = items.Category;
                item.Quantity = items.Quantity;
                _genericCrud.Update(item);
                _genericCrud.Save();
                return Ok();
            }
            return NotFound();
        }   

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteProduct/{id}")]
        public async Task<ActionResult<List<Item>>> DeleteProduct(Guid id)
        {
            var product = _testContext.Items.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            _genericCrud.Delete(id);
            _genericCrud.Save();
            return Ok();
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("EeportToExcel")]
        public async Task<ActionResult> EeportToExcel()
        {
            var response = await _itemServics.ExporDataToFile();
            var fileName = "products.xlsx";
            return Ok(File(response, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName));
        }


        [HttpPost("ImportFromExcel")]
        public async Task<ActionResult> ImportFromExcel([FromForm]ExcelDto excelfile)
        {
            try
            {
                var response = await _itemServics.ImportExcel(excelfile.file);
                if (response)
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch(Exception e) {
                return BadRequest(e);
            }
        }
    }
}
