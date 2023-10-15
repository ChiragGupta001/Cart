using Core_Test_Dal.Data;
using Core_Test_Dal.Models;
using Core_Test_Dal.RepositoryInterfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core_Test_Bal.Services
{
    public class GenericCrud<T> : IGenericCrud<T> where T : class
    {
        private TestContext _context = null;
        private DbSet<T> table = null;

        public GenericCrud(TestContext _context)
        {
            this._context = _context;
            table = _context.Set<T>();
        }
        public async Task<List<T>> GetAll()
        {
            return table.ToList();
        }
        public async Task<T> GetById(object id)
        {
            return table.Find(id);
        }
        public void Insert(T obj)
        {
            table.Add(obj);
        }
        public void Update(T obj2)
        {
            table.Attach(obj2);
            _context.Entry(obj2).State = EntityState.Modified;
        }
        public void Delete(object id)
        {
            T existing = table.Find(id);
            table.Remove(existing);
        }
        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
