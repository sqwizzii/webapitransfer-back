using Core.Models.Search;

namespace Core.Models.Account;

public class UserSearchModel : PaginationModel
{
    public string? Query { get; set; }
}
