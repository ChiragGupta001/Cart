using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core_Test_Dal.Models
{
    public class PageListDto<T>
    {
        public List<Core_Test_Dal.Models.Item> Products{ get; set; }
        public int totalItem { get;  set; }
        public int totalPage { get; set; }
    }
}
