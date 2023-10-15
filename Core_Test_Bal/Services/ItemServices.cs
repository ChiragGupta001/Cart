using Core_Test_Dal.Data;
using Core_Test_Dal.Models;
using Core_Test_Dal.RepositoryInterfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using ClosedXML.Excel;
using OfficeOpenXml;

namespace Core_Test_Bal.Services
{
    public class ItemServices<T> : IitemServices<T> where T : class
    {
        public readonly IGenericCrud<Item> _genericCrud;
        public readonly TestContext _testContext;
        private IHostingEnvironment _host;
        public ItemServices(IGenericCrud<Item> genericCrud, TestContext context, IHostingEnvironment host)
        {
            _genericCrud = genericCrud;
            _testContext = context;
            _host = host;
        }   


        public async Task<PageListDto<T>> sortData(string sortOrder, string sortDirection, string? searchTerm, int pageSize, int pageNumber)
        {
            var query = await _genericCrud.GetAll();
            int skip = (pageNumber - 1) * pageSize;

            bool isDescending = sortDirection == "descending";
            switch (sortOrder.ToLower())
            {
                case "id":
                    query = isDescending ? query.OrderByDescending(item => item.Id).ToList() : query.OrderBy(item => item.Id).ToList();
                    break;
                case "name":
                    query = isDescending ? query.OrderByDescending(item => item.Name).ToList() : query.OrderBy(item => item.Name).ToList();
                    break;
                case "price":
                    query = isDescending ? query.OrderByDescending(item => item.Price).ToList() : query.OrderBy(item => item.Price).ToList();
                    break;
                case "category":
                    query = isDescending ? query.OrderByDescending(item => item.Category).ToList() : query.OrderBy(item => item.Category).ToList();
                    break;
                case "quantity":
                    query = isDescending ? query.OrderByDescending(item => item.Quantity).ToList() : query.OrderBy(item => item.Quantity).ToList();
                    break;
                case "description":
                    query = isDescending ? query.OrderByDescending(item => item.Description).ToList() : query.OrderBy(item => item.Description).ToList();
                    break;
                default:
                    query = query.OrderBy(p => p.Name).ToList();
                    break;
            }
            if (searchTerm != null)
            {
                var finalQuery = query.Where(item =>
                    item.Name.ToLower().Contains(searchTerm.ToLower()) ||
                    item.Description.ToLower().Contains(searchTerm.ToLower()) ||
                    item.Category.ToLower().Contains(searchTerm.ToLower()) || item.Quantity.ToString().Contains(searchTerm) || item.Price.ToString().Contains(searchTerm));
                int totalRecord = finalQuery.Count();
                int pages = (int)Math.Ceiling((double)totalRecord / pageSize);
                var result = finalQuery.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                return new PageListDto<T>
                {
                    Products = result,
                    totalItem = totalRecord,
                    totalPage = pages
                };
            }
            else
            {
                int totalRecord = query.Count();
                int pages = (int)Math.Ceiling((double)totalRecord / pageSize);
                var result = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                return new PageListDto<T>
                {
                    Products = result,
                    totalItem = totalRecord,
                    totalPage = pages
                };
            }
        }

        public string UploadedFile(ItemDto model)
        {
            throw new NotImplementedException();
        }

        public async Task<string> UploadedFile(IFormFile fileUpload)
        {
            try
            {
                if(fileUpload.Length > 0)
                {
                    string path = Path.Combine(_host.WebRootPath+"\\uploads\\");
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);

                    }
                    string filePath = Path.Combine(path, fileUpload.FileName);
                    using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await fileUpload.CopyToAsync(fileStream);
                        return "https://localhost:7038/uploads/" + fileUpload.FileName;                       
                    };
                }
                else
                {
                    return "Failed";
                }
            }catch(Exception ex) {
                return ex.Message;
            } 
        }


        public async Task<byte[]> ExporDataToFile()
        {
            var products = await _genericCrud.GetAll();

            var response = await EeportExcel(products);
            return response;
        }

        public async Task<byte[]> EeportExcel(List<Item> data)
        {
            var products = await _genericCrud.GetAll();
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Products");
                var currentRow = 1;
                worksheet.Cell(currentRow, 1).Value = "Product Name";
                worksheet.Cell(currentRow, 2).Value = "Description";
                worksheet.Cell(currentRow, 3).Value = "Category";
                worksheet.Cell(currentRow, 4).Value = "Price";
                worksheet.Cell(currentRow, 5).Value = "Quantity";
                worksheet.Cell(currentRow, 6).Value = "Image";

                foreach (var product in products)
                {
                    currentRow++;                  
                    worksheet.Cell(currentRow, 1).Value = product.Name;
                    worksheet.Cell(currentRow, 2).Value = product.Description;
                    worksheet.Cell(currentRow, 3).Value = product.Category;
                    worksheet.Cell(currentRow, 4).Value = product.Price;
                    worksheet.Cell(currentRow, 5).Value = product.Quantity;
                    worksheet.Cell(currentRow, 6).Value = product.Image;
                }
                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                return content;
            }
        }

        public async Task<bool> ImportExcel(IFormFile file) 
        {
            List<Item> list = new List<Item>();
            using(var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    var rowcount = worksheet.Dimension.Rows;
                    for(int row = 2; row<=rowcount; row++)
                    {
                       list.Add(new Item 
                       {
                           Id = new Guid(),
                           Name = worksheet.Cells[row,1].Value.ToString(),
                           Description = worksheet.Cells[row, 2].Value.ToString(),
                           Category = worksheet.Cells[row,3].Value.ToString(),
                           Price = decimal.Parse(worksheet.Cells[row, 4].Value.ToString()),
                           Quantity = int.Parse(worksheet.Cells[row, 5].Value.ToString()),
                           Image = worksheet.Cells[row,6].Value.ToString(),
                       });
                    }
                }
            }
            foreach(var product in list)
            {
                _genericCrud.Insert(product);
            }
            _genericCrud.Save();
            return true;
        }
    }
}