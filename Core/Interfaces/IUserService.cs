using Core.Models.Account;
using Core.Models.Search;

namespace Core.Interfaces;

public interface IUserService
{
    Task<UserProfileModel> GetUserProfileAsync();

    Task<SearchResult<UserItemModel>> SearchUsersAsync(UserSearchModel model);
}
