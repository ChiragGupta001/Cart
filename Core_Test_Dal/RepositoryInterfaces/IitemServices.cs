using Core_Test_Dal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Core_Test_Dal.RepositoryInterfaces
{
    public interface IitemServices<T> where T : class
    {
        Task<byte[]> ExporDataToFile();
        Task<PageListDto<T>> sortData(string sortOrder, string sortDirection, string searchTerm, int pageSize, int pageNumber);
        Task<string> UploadedFile(IFormFile fileUpload);
        Task<bool> ImportExcel(IFormFile file);
    }
}
