namespace Core.Models.Account;

public class UserItemModel
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string? PhoneNumber { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
}
