using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core_Test_Dal.Models;

namespace Core_Test_Dal.RepositoryInterfaces
{
    public interface IGenericCrud<T> where T : class
    {
        Task<List<T>> GetAll();
        //Task<PageListDto<T>> GetAllItems(int pagesize, int pageNumber);
        Task<T> GetById(object id);
        void Insert(T obj);
        void Update(T obj);
        void Delete(object id);
        void Save();
    }
}
