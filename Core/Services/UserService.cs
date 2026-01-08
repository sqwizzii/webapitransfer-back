using Core.Interfaces;
using Core.Models.Account;
using Core.Models.Search;
using Domain.Entities.Idenity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Core.Services;

public class UserService(
    UserManager<UserEntity> userManager,
    IHttpContextAccessor httpContextAccessor
) : IUserService
{
    public async Task<UserProfileModel> GetUserProfileAsync()
    {
        var userIdStr = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr))
            throw new Exception("Unauthorized");

        if (!int.TryParse(userIdStr, out var userId))
            throw new Exception("Invalid user id");

        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
            throw new Exception("User not found");

        var roles = await userManager.GetRolesAsync(user);

        return new UserProfileModel
        {
            Email = user.Email ?? "",
            UserName = user.UserName,
            PhoneNumber = user.PhoneNumber,
            Roles = roles.ToList()
        };
    }

    public async Task<SearchResult<UserItemModel>> SearchUsersAsync(UserSearchModel model)
    {
        var q = (model.Query ?? "").Trim().ToLower();

        var query = userManager.Users.AsQueryable();

        if (!string.IsNullOrEmpty(q))
        {
            query = query.Where(u =>
                (u.Email ?? "").ToLower().Contains(q) ||
                (u.UserName ?? "").ToLower().Contains(q) ||
                (u.PhoneNumber ?? "").ToLower().Contains(q)
            );
        }

        var total = await query.CountAsync();

        var page = model.Page <= 0 ? 1 : model.Page;
        var pageSize = model.PageSize <= 0 ? 10 : model.PageSize;

        var users = await query
            .OrderBy(u => u.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = new List<UserItemModel>();

        foreach (var u in users)
        {
            var roles = await userManager.GetRolesAsync(u);

            items.Add(new UserItemModel
            {
                Id = u.Id,
                Email = u.Email ?? "",
                UserName = u.UserName,
                PhoneNumber = u.PhoneNumber,
                Roles = roles
            });
        }

        return new SearchResult<UserItemModel>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }
}
